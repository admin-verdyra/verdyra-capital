"use client";

import { CalendarDays } from "lucide-react";
import type { Customer } from "../types";

type Props = {
  customer: Customer;
};

export default function DashboardHero({
  customer,
}: Props) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F5A3A] via-[#166B47] to-[#1D7C55] p-10 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.25em] text-white/70">
            {greeting}
          </p>

          <h1 className="mt-3 text-4xl font-bold lg:text-5xl">
            {customer.full_name} 👋
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Welcome back. Your application is progressing well.
            Upload pending documents, track your application,
            and stay connected with your Relationship Manager.
          </p>

        </div>

        <div className="rounded-[28px] bg-white/10 p-8 backdrop-blur">

          <div className="flex items-center gap-3">

            <CalendarDays size={22} />

            <span className="text-sm text-white/70">
              Expected Approval
            </span>

          </div>

          <h2 className="mt-4 text-3xl font-bold">

            {customer.expected_approval_date ??
              "To Be Announced"}

          </h2>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/20">

            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-700"
              style={{
                width: `${customer.progress ?? 0}%`,
              }}
            />

          </div>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-white/70">
              Application Progress
            </span>

            <span className="text-xl font-bold">

              {customer.progress ?? 0}%

            </span>

          </div>

        </div>

      </div>

    </section>
  );
}