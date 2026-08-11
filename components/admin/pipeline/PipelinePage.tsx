"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  Clock3,
  BadgeCheck,
  ShieldCheck,
  IndianRupee,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { getAllCustomers, type AdminCustomer } from "@/lib/admin/customerService";
import PipelineBoard from "./PipelineBoard";


type Admin = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  account_status?: string;
};

const ALL_ADMINS = "__ALL_ADMINS__";

export default function PipelinePage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedAdminId, setSelectedAdminId] =
    useState<string>(ALL_ADMINS);

  useEffect(() => {
    async function loadPipeline() {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }

    loadPipeline();
  }, []);

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("admin");

    if (!storedAdmin) {
      return;
    }

    try {
      const admin = JSON.parse(storedAdmin);

      const superAdmin = admin?.role === "Super Admin";

      setIsSuperAdmin(superAdmin);

      if (!superAdmin) {
        setSelectedAdminId(ALL_ADMINS);
        return;
      }

      async function loadAdmins() {
        try {
          setAdminLoading(true);

          const response = await fetch("/api/admin/admins", {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              result.message || "Unable to load Admin accounts."
            );
          }

          setAdmins(result.admins ?? []);
        } catch (error) {
          console.error("Failed to load Admin accounts:", error);
          setAdmins([]);
        } finally {
          setAdminLoading(false);
        }
      }

      loadAdmins();
    } catch (error) {
      console.error("Failed to read admin session:", error);
    }
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!isSuperAdmin || selectedAdminId === ALL_ADMINS) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.created_by_admin_id === selectedAdminId
    );
  }, [customers, isSuperAdmin, selectedAdminId]);

  const stats = useMemo(() => {
    const totalLoanAmount = filteredCustomers.reduce(
      (total, customer) =>
        total + Number(customer.loan_amount ?? 0),
      0
    );

    return {
      total: filteredCustomers.length,

      documents: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Documents Pending"
      ).length,

      creditReview: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Under Credit Evaluation"
      ).length,

      approved: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Approved"
      ).length,

      sanctioned: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Sanctioned"
      ).length,

      disbursed: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Disbursed"
      ).length,

      rejected: filteredCustomers.filter(
        (customer) =>
          customer.application_status === "Rejected"
      ).length,

      totalLoanAmount,
    };
  }, [filteredCustomers]);

  const selectedAdmin = useMemo(() => {
    if (!isSuperAdmin || selectedAdminId === ALL_ADMINS) {
      return null;
    }

    return (
      admins.find(
        (admin) => admin.id === selectedAdminId
      ) ?? null
    );
  }, [admins, isSuperAdmin, selectedAdminId]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-20 text-center">
        Loading pipeline...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Pipeline
          </h1>

          <p className="mt-2 text-slate-500">
            Track every customer through the lending lifecycle.
          </p>
        </div>

        {/* Super Admin only */}
        {isSuperAdmin && (
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <ShieldCheck
                size={18}
                className="text-[#0F5A3A]"
              />

              <span>Admin View</span>
            </div>

            <select
              value={selectedAdminId}
              onChange={(event) =>
                setSelectedAdminId(event.target.value)
              }
              disabled={adminLoading}
              className="min-w-[260px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value={ALL_ADMINS}>
                All Admins
              </option>

              {admins.map((admin) => (
                <option
                  key={admin.id}
                  value={admin.id}
                >
                  {admin.full_name} — {admin.role}
                </option>
              ))}
            </select>

          </div>
        )}

      </div>

      {/* Active filter indicator */}
      {isSuperAdmin && selectedAdmin && (
        <div className="flex items-center justify-between rounded-2xl border border-[#0F5A3A]/10 bg-[#F3F7F4] px-5 py-3">

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="font-medium">
              Showing portfolio for:
            </span>

            <span className="font-bold text-[#0F5A3A]">
              {selectedAdmin.full_name}
            </span>

            <span className="text-slate-500">
              ({selectedAdmin.role})
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedAdminId(ALL_ADMINS)
            }
            className="flex items-center gap-1.5 text-sm font-semibold text-[#0F5A3A] transition hover:underline"
          >
            <XCircle size={16} />
            Show All
          </button>

        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Applications"
          value={stats.total}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Documents Pending"
          value={stats.documents}
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Under Credit Evaluation"
          value={stats.creditReview}
          icon={<Clock3 size={22} />}
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<BadgeCheck size={22} />}
        />

        <StatCard
          title="Sanctioned"
          value={stats.sanctioned}
          icon={<ShieldCheck size={22} />}
        />

        <StatCard
          title="Disbursed"
          value={stats.disbursed}
          icon={<IndianRupee size={22} />}
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle size={22} />}
        />

        <StatCard
          title="Total Loan Amount"
          value={`₹${stats.totalLoanAmount.toLocaleString("en-IN")}`}
          icon={<IndianRupee size={22} />}
        />

      </div>

      {/* Pipeline */}
      <PipelineBoard
        customers={filteredCustomers}
      />

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 truncate text-2xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3F7F4] text-[#0F5A3A]">
          {icon}
        </div>

      </div>

    </div>
  );
}
