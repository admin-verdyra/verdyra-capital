"use client";

import {
  Building2,
  IndianRupee,
  User,
  Phone,
} from "lucide-react";

import type { AdminCustomer } from "@/lib/admin/customerService";

type Props = {
  customer: AdminCustomer;
};

export default function PipelineCard({
  customer,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Customer */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F7F4]">
          <User
            size={20}
            className="text-[#0F5A3A]"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900">
            {customer.full_name}
          </h3>

          <p className="truncate text-xs text-slate-500">
            @{customer.username}
          </p>

          {customer.company && (
            <p className="mt-1 truncate text-xs text-slate-400">
              {customer.company}
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Building2
            size={16}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate">
            {customer.product ?? "Business Loan"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IndianRupee
            size={16}
            className="shrink-0 text-slate-400"
          />

          <span>
            {customer.loan_amount
              ? Number(customer.loan_amount).toLocaleString("en-IN")
              : "N/A"}
          </span>
        </div>

        {customer.relationship_manager && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User
              size={14}
              className="shrink-0"
            />

            <span className="truncate">
              RM: {customer.relationship_manager}
            </span>
          </div>
        )}

        {customer.relationship_manager_phone && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone
              size={13}
              className="shrink-0"
            />

            <span>
              {customer.relationship_manager_phone}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
