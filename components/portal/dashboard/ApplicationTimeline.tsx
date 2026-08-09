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
    <section className="rounded-[30px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
            Journey
          </p>

          <h2 className="mt-2 text-xl md:text-2xl font-bold">
            Application Timeline
          </h2>

        </div>

      </div>

      <div className="mt-8 md:mt-10">

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
                <>
                  {/* Line from bottom of current icon to top of next icon */}
                  <div className="absolute left-5 top-10 h-[calc(100%-20px)] w-[2px] bg-slate-200" />
                </>
              )}

              {/* Icon */}

              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                  completed
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-amber-500 text-white ring-4 ring-amber-500/20"
                    : "bg-slate-200 text-slate-500"
                }`}
              >

                {completed ? (
                  <CheckCircle2 size={18} />
                ) : active ? (
                  <Clock3 size={18} />
                ) : (
                  <Circle size={18} />
                )}

              </div>

              {/* Content */}

              <div className="flex-1 min-w-0">

                <div className="flex items-start justify-between gap-4">

                  <h3 className={`font-semibold text-slate-900 ${active ? "text-lg" : ""}`}>
                    {step.title}
                  </h3>

                  <span className="text-sm text-slate-500 shrink-0">
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