"use client";

import Link from "next/link";
import {
  Upload,
  Calculator,
  PhoneCall,
  CircleHelp,
  FileText,
  CalendarDays,
} from "lucide-react";

const actions = [
  {
    title: "Upload Documents",
    description: "Submit pending KYC documents",
    href: "/portal/documents",
    icon: Upload,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "EMI Calculator",
    description: "Estimate your monthly EMI",
    href: "/#calculator",
    icon: Calculator,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Schedule a Call",
    description: "Book time with your RM",
    href: "/portal/profile",
    icon: CalendarDays,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Download Documents",
    description: "Sanction letters & statements",
    href: "/portal/documents",
    icon: FileText,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Contact Support",
    description: "Speak with Verdyra",
    href: "/portal/profile",
    icon: PhoneCall,
    color: "bg-red-50 text-red-700",
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

      <div className="mt-8 grid gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:border-[#0F5A3A] hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900 group-hover:text-[#0F5A3A]">
                  {action.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {action.description}
                </p>

              </div>

            </Link>
          );
        })}

      </div>

    </section>
  );
}