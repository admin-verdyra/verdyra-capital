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
  const response = await fetch("/api/admin/customers", { method: "GET" });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message ?? "Failed to fetch customers.");
  }

  return result.customers as AdminCustomer[];
}
