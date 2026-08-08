import { supabase } from "@/lib/supabase";

export type AdminCustomer = {
  auth_user_id?: string | null;

  username: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  date_of_birth: string | null;
  application_status: string | null;
  account_status: 'active' | 'disabled';
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  loan_amount: number | null;
  product: string | null;
  expected_approval_date: string | null;
  progress: number | null;
};

export async function getAllCustomers(): Promise<AdminCustomer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select(`
      username,
      full_name,
      email,
      company,
      phone,
      date_of_birth,
      application_status,
      account_status,
      relationship_manager,
      relationship_manager_phone,
      loan_amount,
      product,
      expected_approval_date,
      progress
    `)
    .order("full_name");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminCustomer[];
}
