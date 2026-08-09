import { getApplicationMIS } from "@/lib/admin/dashboard";
import CustomerTable from "./customers/CustomerTable";
import AdminMIS from "./AdminMIS";

export default async function AdminDashboard() {
  const mis = await getApplicationMIS();

  return (
    <div className="space-y-8">
      <AdminMIS data={mis} />
      <CustomerTable />
    </div>
  );
}