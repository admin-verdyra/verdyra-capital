import type { User } from "@supabase/supabase-js";

import {
  createSupabaseServerAuthClient,
  createSupabaseServiceRoleClient,
} from "./supabase.server";

export type CreateSupabaseAuthUserInput = {
  email: string;
  password: string;
  emailConfirm?: boolean;
  userMetadata?: Record<string, unknown>;
};

export async function createSupabaseAuthUser({
  email,
  password,
  emailConfirm = true,
  userMetadata,
}: CreateSupabaseAuthUserInput): Promise<User> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: emailConfirm,
      user_metadata: userMetadata,
    });

  if (error) {
    throw error;
  }

  return data.user;
}

export async function findSupabaseAuthUserById(
  userId: string
): Promise<User | null> {
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } =
    await supabase.auth.admin.getUserById(userId);

  if (error) {
    throw error;
  }

  return data.user;
}

export async function findSupabaseAuthUserByEmail(
  email: string
): Promise<User | null> {
  const supabase = createSupabaseServiceRoleClient();
  const normalizedEmail = email.trim().toLowerCase();
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } =
      await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw error;
    }

    const user =
      data.users.find(
        (candidate) =>
          candidate.email?.toLowerCase() === normalizedEmail
      ) ?? null;

    if (user || data.users.length < perPage) {
      return user;
    }

    page += 1;
  }
}

export async function deleteSupabaseAuthUser(
  userId: string
): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();

  const { error } =
    await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw error;
  }
}

export async function getSupabaseUserFromAccessToken(
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
