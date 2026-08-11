"use client";

import PipelineColumn from "./PipelineColumn";
import type { AdminCustomer } from "@/lib/admin/customerService";

type Props = {
  customers: AdminCustomer[];
};

const STAGES = [
  "Application Received",
  "Login Created",
  "Documents Pending",
  "Document Received",
  "Under Credit Evaluation",
  "Approved",
  "Rejected",
  "Sanctioned",
  "Disbursed",
] as const;

export default function PipelineBoard({ customers }: Props) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">
          Application Pipeline
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Move horizontally through every stage of the lending lifecycle.
        </p>
      </div>

      {/* Dedicated horizontal scrolling area */}
      <div
        className="pipeline-scrollbar overflow-x-auto overflow-y-hidden px-6 pb-6 pt-6"
        style={{
          scrollbarWidth: "auto",
        }}
      >
        <div className="flex w-max min-w-full gap-5">
          {STAGES.map((stage) => {
            const stageCustomers = customers.filter(
              (customer) => customer.application_status === stage
            );

            return (
              <PipelineColumn
                key={stage}
                title={stage}
                customers={stageCustomers}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
