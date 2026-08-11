"use client";

import PipelineCard from "./PipelineCard";
import type { AdminCustomer } from "@/lib/admin/customerService";

type Props = {
  title: string;
  customers: AdminCustomer[];
};

export default function PipelineColumn({
  title,
  customers,
}: Props) {
  return (
    <div className="w-[310px] shrink-0 rounded-3xl bg-slate-100 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="min-w-0 text-base font-bold text-slate-900">
          {title}
        </h2>

        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
          {customers.length}
        </span>
      </div>

      <div className="min-h-[360px] space-y-4">
        {customers.length === 0 ? (
          <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 text-center text-sm text-slate-400">
            No applications
          </div>
        ) : (
          customers.map((customer) => (
            <PipelineCard
              key={customer.username}
              customer={customer}
            />
          ))
        )}
      </div>
    </div>
  );
}
