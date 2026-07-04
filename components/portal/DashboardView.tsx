"use client";

import type { Customer } from "./types";
import ProfileCard from "./ProfileCard";

type Props = {
  customer: Customer;
};

export default function DashboardView({ customer }: Props) {
  return (
    <div className="space-y-8">

      {/* Welcome */}

      <section className="rounded-[28px] bg-gradient-to-r from-[#0F5A3A] to-[#1D7C55] p-8 text-white shadow-xl">

        <p className="text-sm uppercase tracking-[0.25em] text-white/80">
          Welcome Back
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          {customer.full_name} 👋
        </h1>

        <p className="mt-4 max-w-2xl text-white/80">
          Track your loan application, upload documents and stay updated with
          your funding journey.
        </p>

      </section>

      {/* Summary Cards */}

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Loan Amount
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#111111]">
            ₹75 Lakh
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Product
          </p>

          <h2 className="mt-3 text-xl font-bold">
            Business Loan
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <h2 className="mt-3 text-xl font-bold text-emerald-600">
            Documents Pending
          </h2>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Relationship Manager
          </p>

          <h2 className="mt-3 text-xl font-bold">
            Arif Asfi
          </h2>

        </div>

      </div>

      {/* Progress */}

      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Application Progress
        </h2>

        <div className="mt-8 space-y-6">

          <ProgressRow
            complete
            title="Application Submitted"
          />

          <ProgressRow
            complete
            title="Customer Login Created"
          />

          <ProgressRow
            active
            title="Documents Pending"
          />

          <ProgressRow
            title="Credit Assessment"
          />

          <ProgressRow
            title="Sanction"
          />

          <ProgressRow
            title="Disbursement"
          />

        </div>

      </section>

      <ProfileCard customer={customer} />

    </div>
  );
}

type ProgressProps = {
  title: string;
  complete?: boolean;
  active?: boolean;
};

function ProgressRow({
  title,
  complete,
  active,
}: ProgressProps) {
  return (
    <div className="flex items-center gap-4">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
          complete
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-amber-500 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {complete ? "✓" : active ? "•" : ""}
      </div>

      <div>

        <p className="font-semibold">
          {title}
        </p>

      </div>

    </div>
  );
}