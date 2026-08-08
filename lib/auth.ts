import { supabase } from "@/lib/supabase";

export type Customer = {
  auth_user_id?: string | null;

  username: string;
  password: string;

  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;

  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  expected_approval_date: string | null;
  progress: number | null;
};

export async function loginCustomer(
  username: string,
  password: string
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select(`
      username,
      password,
      full_name,
      email,
      company,
      phone,
      loan_amount,
      product,
      application_status,
      relationship_manager,
      relationship_manager_phone,
      expected_approval_date,
      progress
    `)
    .eq("username", username.trim())
    .eq("password", password)
    .maybeSingle<Customer>();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
}
