import { supabase } from "@/lib/supabase";

export type Customer = {
  username: string;
  password: string;
  full_name: string;
  email: string;
};

export async function loginCustomer(
  username: string,
  password: string
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("username,password,full_name,email")
    .eq("username", username.trim())
    .eq("password", password)
    .maybeSingle<Customer>();

  if (error || !data) {
    return null;
  }

  return data;
}