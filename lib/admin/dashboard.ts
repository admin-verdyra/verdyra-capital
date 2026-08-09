import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import { APPLICATION_STATUSES } from "@/lib/admin/applicationStatus";

/**
 * Status-wise MIS data for a single status
 */
export type StatusMIS = {
  count: number;
  amount: number;
};

/**
 * Complete Application MIS data structure
 */
export type ApplicationMIS = {
  totals: {
    applications: number;
    amount: number;
  };
  byStatus: Record<ApplicationStatus, StatusMIS>;
  notSet: StatusMIS;
};

/**
 * Legacy DashboardStats type (kept for backward compatibility)
 * @deprecated Use ApplicationMIS instead
 */
export type DashboardStats = {
  totalCustomers: number;
  totalLoanAmount: number;
  approved: number;
  pending: number;
};

/**
 * Type for ApplicationStatus from applicationStatus.ts
 */
type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * Fetch and aggregate Application MIS data from customers table.
 *
 * Calculates:
 * - Total applications count
 * - Total applied amount (sum of loan_amount, excluding nulls)
 * - Per-status count and amount for all 9 statuses
 * - Not Set (NULL application_status) count and amount
 *
 * All aggregation is performed server-side.
 */
export async function getApplicationMIS(): Promise<ApplicationMIS> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("customers")
    .select("loan_amount, application_status");

  if (error || !data) {
    // Return zeroed structure on error
    return getZeroedMIS();
  }

  // Initialize accumulators
  const byStatus: Record<ApplicationStatus, StatusMIS> = {} as Record<ApplicationStatus, StatusMIS>;
  APPLICATION_STATUSES.forEach((status) => {
    byStatus[status] = { count: 0, amount: 0 };
  });

  const notSet: StatusMIS = { count: 0, amount: 0 };
  let totalApplications = 0;
  let totalAmount = 0;

  // Aggregate data
  for (const row of data) {
    totalApplications++;

    const loanAmount = row.loan_amount !== null && row.loan_amount !== undefined
      ? Number(row.loan_amount)
      : null;

    if (loanAmount !== null && !isNaN(loanAmount)) {
      totalAmount += loanAmount;
    }

    const status = row.application_status;

    if (status && APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
      // Valid status - aggregate into byStatus
      const typedStatus = status as ApplicationStatus;
      byStatus[typedStatus].count++;
      if (loanAmount !== null) {
        byStatus[typedStatus].amount += loanAmount;
      }
    } else {
      // NULL or invalid status - aggregate into notSet
      notSet.count++;
      if (loanAmount !== null) {
        notSet.amount += loanAmount;
      }
    }
  }

  return {
    totals: {
      applications: totalApplications,
      amount: totalAmount,
    },
    byStatus,
    notSet,
  };
}

/**
 * Get zeroed MIS structure for error/empty states
 */
function getZeroedMIS(): ApplicationMIS {
  const byStatus: Record<ApplicationStatus, StatusMIS> = {} as Record<ApplicationStatus, StatusMIS>;
  APPLICATION_STATUSES.forEach((status) => {
    byStatus[status] = { count: 0, amount: 0 };
  });

  return {
    totals: { applications: 0, amount: 0 },
    byStatus,
    notSet: { count: 0, amount: 0 },
  };
}

/**
 * Legacy function - kept for backward compatibility with AdminStats component
 * @deprecated Use getApplicationMIS() instead
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const mis = await getApplicationMIS();

  // Calculate approved as Approved + Disbursed (legacy behavior)
  const approved = mis.byStatus.Approved.count + mis.byStatus.Disbursed.count;
  const pending = mis.totals.applications - approved;

  return {
    totalCustomers: mis.totals.applications,
    totalLoanAmount: mis.totals.amount,
    approved,
    pending,
  };
}