import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import AdminManagement from "@/components/admin/admins/AdminManagement";
import { requireSuperAdmin } from "@/lib/server/adminAuth.server";

export default async function Page() {
  try {
    await requireSuperAdmin();
  } catch {
    redirect("/admin/dashboard");
  }

  return (
    <AdminShell
      title="Settings"
      subtitle="Manage Verdyra administrator accounts and access"
    >
      <AdminManagement />
    </AdminShell>
  );
}
