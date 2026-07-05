"use client";

import {
  X,
  Mail,
  User,
  IndianRupee,
  BriefcaseBusiness,
  CircleCheckBig,
  UserRound,
  CalendarDays,
} from "lucide-react";

import type { Customer } from "@/components/portal/types";

type Props = {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
};

export default function CustomerDetailsDrawer({
  customer,
  open,
  onClose,
}: Props) {
  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-8">

          <div>

            <h2 className="text-3xl font-bold">
              {customer.full_name}
            </h2>

            <p className="mt-2 text-slate-500">
              Customer Profile
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl border p-3 hover:bg-slate-50"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-8">

          <InfoRow
            icon={<Mail size={20} />}
            label="Email"
            value={customer.email}
          />

          <InfoRow
            icon={<BriefcaseBusiness size={20} />}
            label="Product"
            value={customer.product ?? "-"}
          />

          <InfoRow
            icon={<IndianRupee size={20} />}
            label="Loan Amount"
            value={
              customer.loan_amount
                ? `₹${Number(customer.loan_amount).toLocaleString("en-IN")}`
                : "-"
            }
          />

          <InfoRow
            icon={<CircleCheckBig size={20} />}
            label="Application Status"
            value={customer.application_status ?? "-"}
          />

          <InfoRow
            icon={<UserRound size={20} />}
            label="Relationship Manager"
            value={customer.relationship_manager ?? "-"}
          />

          <InfoRow
            icon={<CalendarDays size={20} />}
            label="Expected Approval"
            value={customer.expected_approval_date ?? "-"}
          />

          <div className="grid gap-4 pt-4">

            <button className="rounded-2xl bg-[#0F5A3A] py-4 font-semibold text-white hover:bg-[#0B4B31]">
              Update Status
            </button>

            <button className="rounded-2xl border py-4 font-semibold hover:bg-slate-50">
              Assign Relationship Manager
            </button>

            <button className="rounded-2xl border py-4 font-semibold hover:bg-slate-50">
              Review Documents
            </button>

          </div>

        </div>

      </aside>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-5">

      <div className="rounded-xl bg-slate-100 p-3">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <h3 className="mt-1 font-semibold">
          {value}
        </h3>

      </div>

    </div>
  );
}