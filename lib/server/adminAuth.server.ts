import type { Session, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  createSupabaseServerAnonClient,
  createSupabaseServerAuthClient,
  createSupabaseServiceRoleClient,
} from "./supabase.server";
import {
  createSupabaseAuthUser,
  deleteSupabaseAuthUser,
  findSupabaseAuthUserByEmail,
} from "./supabaseAuth.server";

export const ADMIN_ACCESS_TOKEN_COOKIE =
  "verdyra_admin_access_token";
export const ADMIN_REFRESH_TOKEN_COOKIE =
  "verdyra_admin_refresh_token";

type AdminRecord = {
  id: string;
  username: string;
  password: string;
  full_name: string;
  email: string | null;
  role: string | null;
  auth_user_id: string | null;
};

export type SafeAdmin = {
  id: string;
  username: string;
  full_name: string;
  email: string | null;
  role: string;
  auth_user_id: string;
};

export type AdminLoginResult = {
  admin: SafeAdmin;
  session: Session;
};

export type AdminSessionResult = {
  admin: SafeAdmin;
  session: Session | null;
};

function toSafeAdmin(admin: AdminRecord): SafeAdmin {
  if (!admin.auth_user_id) {
    throw new Error("Admin is not linked to Supabase Auth.");
  }

  return {
    id: admin.id,
    username: admin.username,
    full_name: admin.full_name,
    email: admin.email,
    role: admin.role ?? "Admin",
    auth_user_id: admin.auth_user_id,
  };
}

async function getAdminByLegacyCredentials(
  username: string,
  password: string
): Promise<AdminRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("admins")
    .select(
      "id, username, password, full_name, email, role, auth_user_id"
    )
    .eq("username", username.trim())
    .eq("password", password)
    .maybeSingle<AdminRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function getAdminByAuthUserId(
  authUserId: string
): Promise<AdminRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("admins")
    .select(
      "id, username, password, full_name, email, role, auth_user_id"
    )
    .eq("auth_user_id", authUserId)
    .maybeSingle<AdminRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function linkAdminAuthUser(
  admin: AdminRecord,
  password: string
): Promise<AdminRecord> {
  if (admin.auth_user_id) {
    return admin;
  }

  if (!admin.email) {
    throw new Error(
      "This admin needs an email before Supabase Auth can be linked."
    );
  }

  const existingUser =
    await findSupabaseAuthUserByEmail(admin.email);

  if (existingUser) {
    const session = await signInAdminAuthUser(
      admin.email,
      password
    );

    if (session.user.id !== existingUser.id) {
      throw new Error(
        "Existing Supabase Auth user does not match this admin."
      );
    }

    return updateAdminAuthUserId(admin.username, existingUser.id);
  }

  const user = await createSupabaseAuthUser({
    email: admin.email,
    password,
    emailConfirm: true,
    userMetadata: {
      admin_username: admin.username,
      role: admin.role ?? "Admin",
    },
  });

  try {
    return await updateAdminAuthUserId(admin.username, user.id);
  } catch (error) {
    await deleteSupabaseAuthUser(user.id);
    throw error;
  }
}

async function updateAdminAuthUserId(
  username: string,
  authUserId: string
): Promise<AdminRecord> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("admins")
    .update({
      auth_user_id: authUserId,
    })
    .eq("username", username)
    .select(
      "id, username, password, full_name, email, role, auth_user_id"
    )
    .single<AdminRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function signInAdminAuthUser(
  email: string | null,
  password: string
): Promise<Session> {
  if (!email) {
    throw new Error("This admin does not have an email address.");
  }

  const supabase = createSupabaseServerAnonClient();
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.session) {
    throw error ?? new Error("Supabase Auth did not return a session.");
  }

  return data.session;
}

export async function loginAdminWithSupabaseAuth(
  username: string,
  password: string
): Promise<AdminLoginResult | null> {
  const legacyAdmin =
    await getAdminByLegacyCredentials(username, password);

  if (!legacyAdmin) {
    return null;
  }

  const linkedAdmin =
    await linkAdminAuthUser(legacyAdmin, password);

  const session = await signInAdminAuthUser(
    linkedAdmin.email,
    password
  );

  if (session.user.id !== linkedAdmin.auth_user_id) {
    throw new Error(
      "Supabase Auth user does not match the linked admin record."
    );
  }

  return {
    admin: toSafeAdmin(linkedAdmin),
    session,
  };
}

export async function getAdminFromAccessToken(
  accessToken: string
): Promise<SafeAdmin | null> {
  const user = await getVerifiedUser(accessToken);

  if (!user) {
    return null;
  }

  const admin = await getAdminByAuthUserId(user.id);

  if (!admin) {
    return null;
  }

  return toSafeAdmin(admin);
}

export async function getAdminFromSessionTokens(
  accessToken?: string,
  refreshToken?: string
): Promise<AdminSessionResult | null> {
  if (accessToken) {
    const admin = await getAdminFromAccessToken(accessToken);

    if (admin) {
      return {
        admin,
        session: null,
      };
    }
  }

  if (!refreshToken) {
    return null;
  }

  const supabase = createSupabaseServerAnonClient();
  const { data, error } =
    await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

  if (error || !data.session) {
    return null;
  }

  const admin = await getAdminFromAccessToken(
    data.session.access_token
  );

  if (!admin) {
    return null;
  }

  return {
    admin,
    session: data.session,
  };
}

export async function requireAdmin(): Promise<SafeAdmin> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    ADMIN_ACCESS_TOKEN_COOKIE
  )?.value;
  const refreshToken = cookieStore.get(
    ADMIN_REFRESH_TOKEN_COOKIE
  )?.value;

  const result = await getAdminFromSessionTokens(
    accessToken,
    refreshToken
  );

  if (!result) {
    throw new Error("Admin authentication required.");
  }

  return result.admin;
}

async function getVerifiedUser(
  accessToken: string
): Promise<User | null> {
  const token = accessToken.trim();

  if (!token) {
    return null;
  }

  const supabase = createSupabaseServerAuthClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return null;
  }

  return data.user;
}
