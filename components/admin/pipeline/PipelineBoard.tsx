"use client";

import PipelineColumn from "./PipelineColumn";

type Customer = {
  username: string;
  full_name: string;
  product: string | null;
  loan_amount: number | null;
  application_status: string | null;
};

type Props = {
  customers: Customer[];
};

const STAGES = [
  "Lead",
  "Documents Pending",
  "Credit Review",
  "Approved",
  "Disbursed",
];

export default function PipelineBoard({
  customers,
}: Props) {
  return (
    <div className="overflow-x-auto">

      <div className="flex gap-6 pb-6">

        {STAGES.map((stage) => {

          const stageCustomers = customers.filter(
            (customer) =>
              customer.application_status === stage
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
  );
}