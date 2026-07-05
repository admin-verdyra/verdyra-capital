"use client";

import {
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

const steps = [
  {
    title: "Application Submitted",
    date: "02 Jul 2026",
    status: "completed",
  },
  {
    title: "Customer Login Created",
    date: "03 Jul 2026",
    status: "completed",
  },
  {
    title: "Documents Pending",
    date: "Today",
    status: "active",
  },
  {
    title: "Credit Assessment",
    date: "Upcoming",
    status: "pending",
  },
  {
    title: "Sanction",
    date: "Upcoming",
    status: "pending",
  },
  {
    title: "Disbursement",
    date: "Upcoming",
    status: "pending",
  },
];

export default function ApplicationTimeline() {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
            Journey
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Application Timeline
          </h2>

        </div>

        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          68% Complete
        </div>

      </div>

      <div className="mt-10">

        {steps.map((step, index) => {

          const completed = step.status === "completed";
          const active = step.status === "active";

          return (

            <div
              key={step.title}
              className="relative flex gap-5 pb-8 last:pb-0"
            >

              {/* Line */}

              {index !== steps.length - 1 && (

                <div className="absolute left-5 top-10 h-full w-[2px] bg-slate-200" />

              )}

              {/* Icon */}

              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                  completed
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-amber-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >

                {completed ? (
                  <CheckCircle2 size={20} />
                ) : active ? (
                  <Clock3 size={18} />
                ) : (
                  <Circle size={18} />
                )}

              </div>

              {/* Content */}

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <span className="text-sm text-slate-500">
                    {step.date}
                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-500">

                  {completed &&
                    "Completed successfully."}

                  {active &&
                    "Waiting for customer action."}

                  {step.status === "pending" &&
                    "Will start automatically after previous step."}

                </p>

              </div>

            </div>

          );
        })}

      </div>

    </section>
  );
}