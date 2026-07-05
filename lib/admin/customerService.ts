import { supabase } from "@/lib/supabase";

export type AdminCustomer = {
  username: string;
  full_name: string;
  email: string;
  application_status: string | null;
  relationship_manager: string | null;
  loan_amount: number | null;
  product: string | null;
  progress: number | null;
};

export async function getAllCustomers(): Promise<AdminCustomer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select(`
      username,
      full_name,
      email,
      application_status,
      relationship_manager,
      loan_amount,
      product,
      progress
    `)
    .order("full_name");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminCustomer[];
}