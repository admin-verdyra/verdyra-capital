"use client";

import PipelineCard from "./PipelineCard";

type Props = {
  title: string;
  customers: any[];
};

export default function PipelineColumn({
  title,
  customers,
}: Props) {
  return (
    <div className="min-w-[320px] rounded-3xl bg-slate-100 p-5">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-bold">
          {title}
        </h2>

        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
          {customers.length}
        </span>

      </div>

      <div className="space-y-4">

        {customers.map((customer) => (
          <PipelineCard
            key={customer.username}
            customer={customer}
          />
        ))}

      </div>

    </div>
  );
}