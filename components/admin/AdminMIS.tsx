"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  IndianRupee,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import {
  type AdminWiseMIS,
  type ApplicationMIS,
} from "@/lib/admin/dashboard";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/admin/applicationStatus";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  "Application Received":
    "bg-blue-100 text-blue-800 border-blue-200",
  "Login Created":
    "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Documents Pending":
    "bg-amber-100 text-amber-800 border-amber-200",
  "Document Received":
    "bg-lime-100 text-lime-800 border-lime-200",
  "Under Credit Evaluation":
    "bg-orange-100 text-orange-800 border-orange-200",
  Approved:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected:
    "bg-red-100 text-red-800 border-red-200",
  Sanctioned:
    "bg-purple-100 text-purple-800 border-purple-200",
  Disbursed:
    "bg-teal-100 text-teal-800 border-teal-200",
};

const NOT_SET_COLOR =
  "bg-slate-100 text-slate-800 border-slate-200";

function formatIndianCurrency(amount: number): string {
  if (amount === 0) return "₹0";

  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    const crores = amount / 10000000;

    return `₹${crores.toFixed(
      crores % 1 === 0 ? 0 : 2
    )} Cr`;
  }

  if (absAmount >= 100000) {
    const lakhs = amount / 100000;

    return `₹${lakhs.toFixed(
      lakhs % 1 === 0 ? 0 : 2
    )} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusCard({
  title,
  count,
  amount,
  colorClass,
  isSelected,
  onClick,
}: {
  title: string;
  count: number;
  amount: number;
  colorClass: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`cursor-pointer rounded-[24px] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${colorClass} ${
        isSelected
          ? "ring-2 ring-offset-2 ring-offset-white"
          : ""
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Cases</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {count}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Amount
          </p>

          <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
            {formatIndianCurrency(amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PortfolioMetric({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function AdminWisePortfolio({
  data,
}: {
  data: AdminWiseMIS;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={22}
              className="text-[#0F5A3A]"
            />

            <h2 className="text-2xl font-bold text-slate-900">
              Admin-wise Portfolio
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Merchant ownership and application performance
            across the Verdyra Admin team.
          </p>
        </div>
      </div>

      {/* Portfolio totals */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <PortfolioMetric
          title="Total Merchants"
          value={data.total.merchantCount.toLocaleString()}
          icon={
            <BriefcaseBusiness
              size={23}
            />
          }
          iconClass="bg-blue-50 text-blue-700"
        />

        <PortfolioMetric
          title="Total Applications"
          value={data.total.applicationCount.toLocaleString()}
          icon={
            <Users size={23} />
          }
          iconClass="bg-indigo-50 text-indigo-700"
        />

        <PortfolioMetric
          title="Total Loan Amount"
          value={formatIndianCurrency(
            data.total.totalLoanAmount
          )}
          icon={
            <IndianRupee size={23} />
          }
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <PortfolioMetric
          title="Approved / Disbursed"
          value={data.total.approvedCount.toLocaleString()}
          icon={
            <CheckCircle2
              size={23}
            />
          }
          iconClass="bg-teal-50 text-teal-700"
        />

        <PortfolioMetric
          title="Pending"
          value={data.total.pendingCount.toLocaleString()}
          icon={
            <Clock3 size={23} />
          }
          iconClass="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Admin-wise table */}
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Owner
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Merchants
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Applications
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Approved
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pending
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Loan Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {data.admins.map((admin) => (
                <tr
                  key={admin.adminId}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F5A3A]/10 font-semibold text-[#0F5A3A]">
                        {admin.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {admin.fullName}
                          </p>

                          {admin.role ===
                            "Super Admin" && (
                            <span className="rounded-full bg-[#0F5A3A]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0F5A3A]">
                              Super Admin
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500">
                          @{admin.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-slate-900">
                    {admin.merchantCount.toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-slate-900">
                    {admin.applicationCount.toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-emerald-700">
                      {admin.approvedCount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="font-semibold text-amber-700">
                      {admin.pendingCount.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right font-mono font-semibold text-slate-900">
                    {formatIndianCurrency(
                      admin.totalLoanAmount
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-5 py-4 text-sm font-bold text-slate-900">
                  TOTAL VERDYRA
                </td>

                <td className="px-5 py-4 text-right font-bold text-slate-900">
                  {data.total.merchantCount.toLocaleString()}
                </td>

                <td className="px-5 py-4 text-right font-bold text-slate-900">
                  {data.total.applicationCount.toLocaleString()}
                </td>

                <td className="px-5 py-4 text-right font-bold text-emerald-700">
                  {data.total.approvedCount.toLocaleString()}
                </td>

                <td className="px-5 py-4 text-right font-bold text-amber-700">
                  {data.total.pendingCount.toLocaleString()}
                </td>

                <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                  {formatIndianCurrency(
                    data.total.totalLoanAmount
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}

interface AdminMISProps {
  data: ApplicationMIS;
  adminWiseMIS?: AdminWiseMIS | null;
  applicationStatus?: string;
  selectedStatus?: string | null;
}

export default function AdminMIS({
  data,
  adminWiseMIS,
  applicationStatus,
  selectedStatus,
}: AdminMISProps) {
  const mis = data;

  const effectiveSelectedStatus =
    selectedStatus ?? applicationStatus ?? null;

  const statuses = [...APPLICATION_STATUSES];

  const router = useRouter();
  const searchParams = useSearchParams();

  function handleStatusClick(status: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (status === "Not Set") {
      params.set(
        "application_status",
        "Not Set"
      );
    } else {
      params.set(
        "application_status",
        status
      );
    }

    router.push(
      `/admin/dashboard?${params.toString()}`
    );
  }

  function handleClearFilter() {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("application_status");

    router.push(
      `/admin/dashboard?${params.toString()}`
    );
  }

  return (
    <div className="space-y-8">
      {/* Super Admin Portfolio */}
      {adminWiseMIS && (
        <AdminWisePortfolio
          data={adminWiseMIS}
        />
      )}

      {/* Existing Application Summary */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Applications
              </p>

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
              <p className="text-sm text-slate-500">
                Total Applied Amount
              </p>

              <h2 className="mt-3 font-mono text-3xl font-bold text-slate-900">
                {formatIndianCurrency(
                  mis.totals.amount
                )}
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
              <p className="text-sm text-slate-500">
                Not Set
              </p>

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
                <circle
                  cx={12}
                  cy={12}
                  r={10}
                />

                <line
                  x1={12}
                  y1={8}
                  x2={12}
                  y2={12}
                />

                <line
                  x1={12}
                  y1={16}
                  x2={12.01}
                  y2={16}
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Status-wise MIS */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Application Pipeline / MIS
          </h2>

          {effectiveSelectedStatus && (
            <button
              onClick={handleClearFilter}
              className="flex items-center gap-1 text-sm font-medium text-[#0F5A3A] hover:underline"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line
                  x1={18}
                  y1={6}
                  x2={6}
                  y2={18}
                />

                <line
                  x1={6}
                  y1={6}
                  x2={18}
                  y2={18}
                />
              </svg>

              Clear Filter
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statuses.map((status) => (
            <StatusCard
              key={status}
              title={status}
              count={mis.byStatus[status].count}
              amount={mis.byStatus[status].amount}
              colorClass={
                STATUS_COLORS[status]
              }
              isSelected={
                effectiveSelectedStatus ===
                status
              }
              onClick={() =>
                handleStatusClick(status)
              }
            />
          ))}

          <StatusCard
            title="Not Set"
            count={mis.notSet.count}
            amount={mis.notSet.amount}
            colorClass={NOT_SET_COLOR}
            isSelected={
              effectiveSelectedStatus ===
              "Not Set"
            }
            onClick={() =>
              handleStatusClick("Not Set")
            }
          />
        </div>
      </section>
    </div>
  );
}
