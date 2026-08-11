import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import { APPLICATION_STATUSES } from "@/lib/admin/applicationStatus";
import { SafeAdmin, isSuperAdmin } from "@/lib/server/adminAuth.server";

/**
 * Status-wise MIS data for a single status.
 */
export type StatusMIS = {
  count: number;
  amount: number;
};

/**
 * Complete Application MIS data structure.
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
 * Admin-wise portfolio MIS.
 *
 * Used by Super Admin to see the complete Verdyra portfolio
 * split by merchant ownership.
 */
export type AdminWiseMISRow = {
  adminId: string;
  username: string;
  fullName: string;
  email: string | null;
  role: string;
  accountStatus: string;
  merchantCount: number;
  applicationCount: number;
  totalLoanAmount: number;
  approvedCount: number;
  pendingCount: number;
};

/**
 * Complete Admin-wise MIS structure.
 */
export type AdminWiseMIS = {
  total: {
    merchantCount: number;
    applicationCount: number;
    totalLoanAmount: number;
    approvedCount: number;
    pendingCount: number;
  };
  admins: AdminWiseMISRow[];
};

/**
 * Legacy DashboardStats type.
 *
 * Kept for backward compatibility with AdminStats.
 */
export type DashboardStats = {
  totalCustomers: number;
  totalLoanAmount: number;
  approved: number;
  pending: number;
};

/**
 * Type for ApplicationStatus from applicationStatus.ts.
 */
type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * Fetch and aggregate Application MIS data from customers table.
 *
 * Super Admin:
 *   Sees all customers.
 *
 * Normal Admin:
 *   Sees only customers owned by that Admin.
 */
export async function getApplicationMIS(
  admin: SafeAdmin
): Promise<ApplicationMIS> {
  const supabase = createSupabaseServiceRoleClient();

  let query = supabase
    .from("customers")
    .select("loan_amount, application_status");

  if (!isSuperAdmin(admin)) {
    query = query.eq("created_by_admin_id", admin.id);
  }

  const { data, error } = await query;

  if (error || !data) {
    return getZeroedMIS();
  }

  const byStatus: Record<ApplicationStatus, StatusMIS> =
    {} as Record<ApplicationStatus, StatusMIS>;

  APPLICATION_STATUSES.forEach((status) => {
    byStatus[status] = {
      count: 0,
      amount: 0,
    };
  });

  const notSet: StatusMIS = {
    count: 0,
    amount: 0,
  };

  let totalApplications = 0;
  let totalAmount = 0;

  for (const row of data) {
    totalApplications++;

    const loanAmount =
      row.loan_amount !== null && row.loan_amount !== undefined
        ? Number(row.loan_amount)
        : null;

    if (loanAmount !== null && !Number.isNaN(loanAmount)) {
      totalAmount += loanAmount;
    }

    const status = row.application_status;

    if (
      status &&
      APPLICATION_STATUSES.includes(status as ApplicationStatus)
    ) {
      const typedStatus = status as ApplicationStatus;

      byStatus[typedStatus].count++;

      if (loanAmount !== null && !Number.isNaN(loanAmount)) {
        byStatus[typedStatus].amount += loanAmount;
      }
    } else {
      notSet.count++;

      if (loanAmount !== null && !Number.isNaN(loanAmount)) {
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
 * Fetch Admin-wise portfolio MIS.
 *
 * IMPORTANT:
 * This function is intended for Super Admin only.
 *
 * Every Admin receives a row, even when they currently have
 * zero merchants.
 *
 * Merchant ownership is determined exclusively by:
 *
 * customers.created_by_admin_id -> admins.id
 *
 * Therefore merchant transfers automatically change the
 * Admin-wise dashboard numbers.
 */
export async function getAdminWiseMIS(
  admin: SafeAdmin
): Promise<AdminWiseMIS> {
  const zeroResult: AdminWiseMIS = {
    total: {
      merchantCount: 0,
      applicationCount: 0,
      totalLoanAmount: 0,
      approvedCount: 0,
      pendingCount: 0,
    },
    admins: [],
  };

  if (!isSuperAdmin(admin)) {
    return zeroResult;
  }

  const supabase = createSupabaseServiceRoleClient();

  const [{ data: admins, error: adminsError }, { data: customers, error: customersError }] =
    await Promise.all([
      supabase
        .from("admins")
        .select(
          "id, username, full_name, email, role, account_status, created_at"
        )
        .order("role", { ascending: true })
        .order("full_name", { ascending: true }),

      supabase
        .from("customers")
        .select(
          "id, created_by_admin_id, loan_amount, application_status"
        ),
    ]);

  if (adminsError || customersError || !admins || !customers) {
    console.error("Admin-wise MIS failed:", {
      adminsError,
      customersError,
    });

    return zeroResult;
  }

  const rows = new Map<string, AdminWiseMISRow>();

  for (const adminRecord of admins) {
    rows.set(adminRecord.id, {
      adminId: adminRecord.id,
      username: adminRecord.username,
      fullName: adminRecord.full_name,
      email: adminRecord.email ?? null,
      role: adminRecord.role ?? "Admin",
      accountStatus: adminRecord.account_status ?? "active",
      merchantCount: 0,
      applicationCount: 0,
      totalLoanAmount: 0,
      approvedCount: 0,
      pendingCount: 0,
    });
  }

  let totalMerchantCount = 0;
  let totalApplicationCount = 0;
  let totalLoanAmount = 0;
  let totalApprovedCount = 0;
  let totalPendingCount = 0;

  for (const customer of customers) {
    const ownerId = customer.created_by_admin_id;

    /*
     * A customer without an owner should not happen after our
     * RBAC cleanup. Ignore it here rather than creating a fake
     * "Unknown Admin" bucket.
     */
    if (!ownerId) {
      continue;
    }

    const owner = rows.get(ownerId);

    if (!owner) {
      /*
       * Defensive handling for unexpected orphaned ownership.
       * Do not manufacture an Admin row.
       */
      continue;
    }

    owner.merchantCount++;
    owner.applicationCount++;

    totalMerchantCount++;
    totalApplicationCount++;

    const loanAmount =
      customer.loan_amount !== null &&
      customer.loan_amount !== undefined
        ? Number(customer.loan_amount)
        : 0;

    if (!Number.isNaN(loanAmount)) {
      owner.totalLoanAmount += loanAmount;
      totalLoanAmount += loanAmount;
    }

    const status = customer.application_status;

    if (status === "Approved" || status === "Disbursed") {
      owner.approvedCount++;
      totalApprovedCount++;
    } else {
      owner.pendingCount++;
      totalPendingCount++;
    }
  }

  /*
   * Put Super Admin first, followed by normal Admins.
   */
  const sortedAdmins = Array.from(rows.values()).sort((a, b) => {
    if (a.role === "Super Admin" && b.role !== "Super Admin") {
      return -1;
    }

    if (a.role !== "Super Admin" && b.role === "Super Admin") {
      return 1;
    }

    return a.fullName.localeCompare(b.fullName);
  });

  return {
    total: {
      merchantCount: totalMerchantCount,
      applicationCount: totalApplicationCount,
      totalLoanAmount,
      approvedCount: totalApprovedCount,
      pendingCount: totalPendingCount,
    },
    admins: sortedAdmins,
  };
}

/**
 * Get zeroed Application MIS structure.
 */
function getZeroedMIS(): ApplicationMIS {
  const byStatus: Record<ApplicationStatus, StatusMIS> =
    {} as Record<ApplicationStatus, StatusMIS>;

  APPLICATION_STATUSES.forEach((status) => {
    byStatus[status] = {
      count: 0,
      amount: 0,
    };
  });

  return {
    totals: {
      applications: 0,
      amount: 0,
    },
    byStatus,
    notSet: {
      count: 0,
      amount: 0,
    },
  };
}

/**
 * Legacy function.
 *
 * Kept for backward compatibility with AdminStats.
 */
export async function getDashboardStats(
  admin: SafeAdmin
): Promise<DashboardStats> {
  const mis = await getApplicationMIS(admin);

  const approved =
    mis.byStatus.Approved.count +
    mis.byStatus.Disbursed.count;

  const pending =
    mis.totals.applications - approved;

  return {
    totalCustomers: mis.totals.applications,
    totalLoanAmount: mis.totals.amount,
    approved,
    pending,
  };
}
