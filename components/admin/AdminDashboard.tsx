import { getApplicationMIS } from "@/lib/admin/dashboard";
import CustomerTable from "./customers/CustomerTable";
import AdminMIS from "./AdminMIS";
import { APPLICATION_STATUSES } from "@/lib/admin/applicationStatus";
import { requireAdmin } from "@/lib/server/adminAuth.server";

interface AdminDashboardProps {
  searchParams: Promise<{ application_status?: string }>;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const resolvedSearchParams = await searchParams;
  const selectedStatus = resolvedSearchParams.application_status || null;

  // Validate the status parameter
  const validStatus = selectedStatus && APPLICATION_STATUSES.includes(selectedStatus as (typeof APPLICATION_STATUSES)[number])
    ? selectedStatus
    : selectedStatus === "Not Set"
      ? "Not Set"
      : null;

  // Authenticate admin server-side
  const admin = await requireAdmin();

  const mis = await getApplicationMIS(admin);

  return (
    <div className="space-y-8">
      <AdminMIS data={mis} selectedStatus={validStatus} />
      <CustomerTable selectedStatus={validStatus} />
    </div>
  );
}
