"use client";

import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  CircleCheckBig,
  UserRound,
} from "lucide-react";

import type { Customer } from "../types";

type Props = {
  customer: Customer;
};

export default function DashboardStats({
  customer,
}: Props) {
  const stats = [
    {
      title: "Loan Amount",
      value: customer.loan_amount
        ? `₹${Number(customer.loan_amount).toLocaleString("en-IN")}`
        : "N/A",
      subtitle: "Eligible Amount",
      icon: BadgeIndianRupee,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Product",
      value: customer.product ?? "N/A",
      subtitle: "Funding Product",
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Application Status",
      value: customer.application_status ?? "N/A",
      subtitle: "Current Stage",
      icon: CircleCheckBig,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {item.subtitle}
                </p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}