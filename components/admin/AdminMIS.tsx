"use client";

import { Users, IndianRupee } from "lucide-react";

import { type ApplicationMIS } from "@/lib/admin/dashboard";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/admin/applicationStatus";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  "Application Received": "bg-blue-100 text-blue-800 border-blue-200",
  "Login Created": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Documents Pending": "bg-amber-100 text-amber-800 border-amber-200",
  "Document Received": "bg-lime-100 text-lime-800 border-lime-200",
  "Under Credit Evaluation": "bg-orange-100 text-orange-800 border-orange-200",
  "Approved": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Rejected": "bg-red-100 text-red-800 border-red-200",
  "Sanctioned": "bg-purple-100 text-purple-800 border-purple-200",
  "Disbursed": "bg-teal-100 text-teal-800 border-teal-200",
};

const NOT_SET_COLOR = "bg-slate-100 text-slate-800 border-slate-200";

function formatIndianCurrency(amount: number): string {
  if (amount === 0) return "₹0";

  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    // 1 Crore = 10,000,000
    const crores = amount / 10000000;
    return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Cr`;
  }

  if (absAmount >= 100000) {
    // 1 Lakh = 100,000
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusCard({
  title,
  count,
  amount,
  colorClass,
}: {
  title: string;
  count: number;
  amount: number;
  colorClass: string;
}) {
  return (
    <div className={`rounded-[24px] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${colorClass}`}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Cases</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Amount</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {formatIndianCurrency(amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AdminMISProps {
  data: ApplicationMIS;
}

export default function AdminMIS({ data }: AdminMISProps) {
  const mis = data;
  const statuses = [...APPLICATION_STATUSES];

  return (
    <div className="space-y-8">
      {/* Top Summary Metrics */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Applications</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {mis.totals.applications.toLocaleString()}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Users size={28} />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Applied Amount</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 font-mono">
                {formatIndianCurrency(mis.totals.amount)}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <IndianRupee size={28} />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Not Set</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {mis.notSet.count}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx={12} cy={12} r={10} />
                <line x1={12} y1={8} x2={12} y2={12} />
                <line x1={12} y1={16} x2={12.01} y2={16} />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Status-wise MIS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Application Pipeline / MIS</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statuses.map((status) => (
            <StatusCard
              key={status}
              title={status}
              count={mis.byStatus[status].count}
              amount={mis.byStatus[status].amount}
              colorClass={STATUS_COLORS[status]}
            />
          ))}

          <StatusCard
            title="Not Set"
            count={mis.notSet.count}
            amount={mis.notSet.amount}
            colorClass={NOT_SET_COLOR}
          />
        </div>
      </section>
    </div>
  );
}