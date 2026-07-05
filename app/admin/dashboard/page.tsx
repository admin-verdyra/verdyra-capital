import AdminShell from "@/components/admin/AdminShell";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProtectedRoute from "@/components/admin/auth/AdminProtectedRoute";

export default function DashboardPage() {
  return (
    <AdminProtectedRoute>

      <AdminShell
        title="Dashboard"
        subtitle="Welcome back to Verdyra Admin"
      >
        <AdminDashboard />
      </AdminShell>

    </AdminProtectedRoute>
  );
}