"use client";

import type { Customer } from "./types";

type ProfileCardProps = {
  customer: Customer;
};

export default function ProfileCard({ customer }: ProfileCardProps) {
  const initials = customer.full_name
    ? customer.full_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "C";

  const profileItems = [
    {
      label: "Full Name",
      value: customer.full_name,
    },
    {
      label: "Username",
      value: customer.username,
    },
    {
      label: "Email",
      value: customer.email,
    },
  ];

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
            Profile
          </p>

          <h3 className="mt-2 text-xl md:text-2xl font-bold text-slate-900">
            Customer Information
          </h3>
        </div>

        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0F5A3A] to-[#1D7C55] text-xl md:text-2xl font-bold text-white shadow-lg">
          {initials}
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        {profileItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-3 break-words text-base font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}
