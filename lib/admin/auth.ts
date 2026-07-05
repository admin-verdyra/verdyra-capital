import { supabase } from "@/lib/supabase";

export type Admin = {
  username: string;
  password: string;
  full_name: string;
  email: string;
  role: string;
};

export async function loginAdmin(
  username: string,
  password: string
): Promise<Admin | null> {
  const { data, error } = await supabase
    .from("admins")
    .select(`
      username,
      password,
      full_name,
      email,
      role
    `)
    .eq("username", username.trim())
    .eq("password", password)
    .maybeSingle<Admin>();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
}