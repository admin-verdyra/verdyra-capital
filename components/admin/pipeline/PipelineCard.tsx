"use client";

import {
  Building2,
  IndianRupee,
  User,
} from "lucide-react";

type Props = {
  customer: {
    username: string;
    full_name: string;
    product: string | null;
    loan_amount: number | null;
    application_status: string | null;
  };
};

export default function PipelineCard({
  customer,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F7F4]">

          <User
            size={22}
            className="text-[#0F5A3A]"
          />

        </div>

        <div>

          <h3 className="font-bold">
            {customer.full_name}
          </h3>

          <p className="text-xs text-slate-500">
            {customer.username}
          </p>

        </div>

      </div>

      <div className="mt-5 space-y-3 text-sm">

        <div className="flex items-center gap-2">

          <Building2 size={16} />

          {customer.product ?? "Business Loan"}

        </div>

        <div className="flex items-center gap-2">

          <IndianRupee size={16} />

          {customer.loan_amount
            ? Number(
                customer.loan_amount
              ).toLocaleString("en-IN")
            : "N/A"}

        </div>

      </div>

    </div>
  );
}