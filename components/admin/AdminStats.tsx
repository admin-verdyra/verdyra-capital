"use client";

import { Users, IndianRupee, BadgeCheck, Clock3 } from "lucide-react";

import { type DashboardStats } from "@/lib/admin/dashboard";

interface AdminStatsProps {
  data: DashboardStats;
}

export default function AdminStats({ data }: AdminStatsProps) {
  const stats = data;

  const cards = [
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Loan Amount",
      value: "₹" + stats.totalLoanAmount.toLocaleString("en-IN"),
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Approved",
      value: stats.approved.toString(),
      icon: BadgeCheck,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {card.value}
                </h2>

              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
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