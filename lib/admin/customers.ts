import { supabase } from "@/lib/supabase";
import type { Customer } from "@/components/portal/types";

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("full_name");

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Customer[];
}

export async function getCustomer(
  username: string
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Customer;
}

export async function updateCustomerStatus(
  username: string,
  status: string
) {
  const { error } = await supabase
    .from("customers")
    .update({
      application_status: status,
    })
    .eq("username", username);

  if (error) {
    throw error;
  }
}

export async function assignRelationshipManager(
  username: string,
  manager: string
) {
  const { error } = await supabase
    .from("customers")
    .update({
      relationship_manager: manager,
    })
    .eq("username", username);

  if (error) {
    throw error;
  }
}