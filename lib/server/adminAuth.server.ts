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

export class AdminAuthorizationError extends Error {
  code = "ADMIN_AUTHORIZATION_ERROR";
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

export class AdminRoleError extends Error {
  code = "ADMIN_ROLE_ERROR";
  constructor(message: string) {
    super(message);
    this.name = "AdminRoleError";
  }
}

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

async function getAdminByAuthUserId(
  authUserId: string
): Promise<AdminRecord | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("admins")
    .select(
      "id, username, full_name, email, role, auth_user_id"
    )
    .eq("auth_user_id", authUserId)
    .maybeSingle<AdminRecord>();

  if (error) {
    throw error;
  }

  return data;
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
      "id, username, full_name, email, role, auth_user_id"
    )
    .single<AdminRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export async function loginAdminWithSupabaseAuth(
  email: string,
  password: string
): Promise<AdminLoginResult | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  // Authenticate directly through Supabase Auth
  const supabase = createSupabaseServerAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.session || !data.user) {
    return null;
  }

  // Resolve the corresponding admin record by auth_user_id
  const admin = await getAdminByAuthUserId(data.user.id);

  if (!admin) {
    // Supabase Auth user exists but no admin record - not authorized
    return null;
  }

  // Verify the email matches (defense in depth)
  if (admin.email?.toLowerCase() !== normalizedEmail) {
    return null;
  }

  return {
    admin: toSafeAdmin(admin),
    session: data.session,
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

export async function requireSuperAdmin(): Promise<SafeAdmin> {
  const admin = await requireAdmin();

  if (admin.role !== "Super Admin") {
    throw new AdminAuthorizationError(
      "Super Admin access required."
    );
  }

  return admin;
}

export async function requireAdminRole(): Promise<SafeAdmin> {
  const admin = await requireAdmin();

  const validRoles = ["Super Admin", "Admin"];

  if (!validRoles.includes(admin.role)) {
    throw new AdminRoleError(
      `Invalid admin role: ${admin.role}. Supported roles: ${validRoles.join(", ")}`
    );
  }

  return admin;
}

export function isSuperAdmin(admin: SafeAdmin): boolean {
  return admin.role === "Super Admin";
}

export function canAccessMerchant(
  admin: SafeAdmin,
  merchantCreatedByAdminId: string | null
): boolean {
  // Super Admin passes ownership checks automatically
  if (isSuperAdmin(admin)) {
    return true;
  }

  // Normal Admin: must have a non-NULL created_by_admin_id that matches their id
  if (merchantCreatedByAdminId === null) {
    return false;
  }

  return merchantCreatedByAdminId === admin.id;
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
