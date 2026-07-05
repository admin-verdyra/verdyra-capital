import AdminShell from "@/components/admin/AdminShell";
import AdminProtectedRoute from "@/components/admin/auth/AdminProtectedRoute";
import CustomerTable from "@/components/admin/customers/CustomerTable";

export default function CustomersPage() {
  return (
    <AdminProtectedRoute>
      <AdminShell
        title="Customers"
        subtitle="Manage all Verdyra customers"
      >
        <CustomerTable />
      </AdminShell>
    </AdminProtectedRoute>
  );
}