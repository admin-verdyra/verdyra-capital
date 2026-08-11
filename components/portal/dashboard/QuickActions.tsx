"use client";

import Link from "next/link";
import {
  Calculator,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

const actions = [
  {
    title: "EMI Calculator",
    description: "Estimate your monthly repayment",
    href: "/portal/emi-calculator",
    icon: Calculator,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Contact Relationship Manager",
    description: "Connect directly with your Relationship Manager",
    href: "/portal/dashboard#relationship-manager",
    icon: PhoneCall,
    color: "bg-purple-50 text-purple-700",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        Shortcuts
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} shrink-0`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1 min-w-0">

                <h3 className="font-semibold text-slate-900 group-hover:text-[#0F5A3A] transition-colors duration-200">
                  {action.title}
                </h3>

                <p className="mt-0.5 text-sm text-slate-500 leading-snug">
                  {action.description}
                </p>

              </div>

              <div className="flex items-center justify-center shrink-0">
                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-slate-500 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>

            </Link>
          );
        })}

      </div>

    </section>
  );
}
