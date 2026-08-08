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

export async function updateAccountStatus(
  username: string,
  accountStatus: 'active' | 'disabled'
) {
  const { error } = await supabase
    .from("customers")
    .update({
      account_status: accountStatus,
    })
    .eq("username", username);

  if (error) {
    throw error;
  }
}

export type UpdateCustomerData = {
  full_name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  date_of_birth?: string | null;
  loan_amount?: number | null;
  product?: string | null;
  application_status?: string | null;
  relationship_manager?: string | null;
  relationship_manager_phone?: string | null;
  expected_approval_date?: string | null;
  progress?: number | null;
};

export async function updateCustomer(
  username: string,
  data: UpdateCustomerData
): Promise<Customer> {
  const response = await fetch("/api/admin/customers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, ...data }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update customer");
  }

  return result.customer;
}

export async function deleteCustomer(username: string): Promise<void> {
  const response = await fetch(
    `/api/admin/customers?username=${encodeURIComponent(username)}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete customer");
  }
}
