"use client";

import {
  BadgeCheck,
  FileText,
  Upload,
} from "lucide-react";

const activities = [
  {
    title: "PAN Card Uploaded",
    time: "Today • 10:45 AM",
    icon: Upload,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "GST Certificate Uploaded",
    time: "Yesterday • 3:12 PM",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Application Submitted",
    time: "2 Jul 2026",
    icon: BadgeCheck,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        Updates
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-8 space-y-6">

        {activities.map((activity) => {

          const Icon = activity.icon;

          return (

            <div
              key={activity.title}
              className="flex items-start gap-4"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activity.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.time}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </section>
  );
}