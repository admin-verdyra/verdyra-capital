"use client";

import AdminStats from "./AdminStats";
import CustomerTable from "./customers/CustomerTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <AdminStats />

      <CustomerTable />

    </div>
  );
}