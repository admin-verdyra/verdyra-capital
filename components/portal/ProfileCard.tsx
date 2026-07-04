"use client";

import type { Customer } from "./types";

type ProfileCardProps = {
  customer: Customer;
};

export default function ProfileCard({ customer }: ProfileCardProps) {
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
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Profile
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#111111]">
            Customer Information
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDF7F2] text-2xl">
          👤
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        {profileItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-[#F8FAF9] p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-3 break-words text-base font-semibold text-[#111111]">
              {item.value}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}