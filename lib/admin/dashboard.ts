import { supabase } from "@/lib/supabase";

export type DashboardStats = {
  totalCustomers: number;
  totalLoanAmount: number;
  approved: number;
  pending: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase
    .from("customers")
    .select("loan_amount, application_status");

  if (error || !data) {
    return {
      totalCustomers: 0,
      totalLoanAmount: 0,
      approved: 0,
      pending: 0,
    };
  }

  const totalCustomers = data.length;

  const totalLoanAmount = data.reduce(
    (sum, row) => sum + Number(row.loan_amount ?? 0),
    0
  );

  const approved = data.filter(
    (c) =>
      c.application_status === "Approved" ||
      c.application_status === "Disbursed"
  ).length;

  const pending = totalCustomers - approved;

  return {
    totalCustomers,
    totalLoanAmount,
    approved,
    pending,
  };
}