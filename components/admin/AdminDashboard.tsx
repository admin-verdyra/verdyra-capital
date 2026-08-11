import {
  getAdminWiseMIS,
  getApplicationMIS,
} from "@/lib/admin/dashboard";
import {
  isSuperAdmin,
  requireAdmin,
} from "@/lib/server/adminAuth.server";
import AdminMIS from "@/components/admin/AdminMIS";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    application_status?: string;
  }>;
}) {
  const admin = await requireAdmin();

  const mis = await getApplicationMIS(admin);

  /*
   * Admin-wise MIS is only required for Super Admin.
   *
   * Normal Admins continue to receive the existing
   * application MIS experience.
   */
  const adminWiseMIS = isSuperAdmin(admin)
    ? await getAdminWiseMIS(admin)
    : null;

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AdminMIS
        data={mis}
        adminWiseMIS={adminWiseMIS}
        applicationStatus={params.application_status}
      />
    </div>
  );
}
