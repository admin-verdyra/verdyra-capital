"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import {
  CheckCircle2,
  Clock3,
  Circle,
  XCircle,
} from "lucide-react";

const TIMELINE_STAGES = [
  "Application Received",
  "Login Created",
  "Documents Pending",
  "Document Received",
  "Under Credit Evaluation",
  "Approved / Rejected",
  "Sanctioned",
  "Disbursed",
] as const;

type TimelineStage = (typeof TIMELINE_STAGES)[number];

type StageStatus = "completed" | "current" | "pending" | "inactive";

interface StageInfo {
  title: string;
  status: StageStatus;
  description: string;
}

function getStageStatuses(
  applicationStatus: string | null
): Record<TimelineStage, StageInfo> {
  const statuses: Record<TimelineStage, StageInfo> = {} as Record<
    TimelineStage,
    StageInfo
  >;

  if (!applicationStatus) {
    // NULL status - all stages pending
    TIMELINE_STAGES.forEach((stage, index) => {
      statuses[stage] = {
        title: stage,
        status: "pending",
        description: index === 0 ? "Awaiting application submission." : "Will start automatically after previous step.",
      };
    });
    return statuses;
  }

  const currentIndex = TIMELINE_STAGES.indexOf(applicationStatus as TimelineStage);
  const isRejected = applicationStatus === "Rejected";
  const isApproved = applicationStatus === "Approved";
  const isSanctioned = applicationStatus === "Sanctioned";
  const isDisbursed = applicationStatus === "Disbursed";

  TIMELINE_STAGES.forEach((stage, index) => {
    let status: StageStatus;
    let description: string;

    if (stage === "Approved / Rejected") {
      // Special handling for the decision stage
      if (isRejected) {
        status = index <= currentIndex ? "completed" : "inactive";
        description = "Application was rejected.";
      } else if (isApproved || isSanctioned || isDisbursed) {
        status = "completed";
        description = "Application was approved.";
      } else if (currentIndex === index) {
        status = "current";
        description = "Under credit evaluation - decision pending.";
      } else if (currentIndex > index) {
        status = "completed";
        description = "Completed successfully.";
      } else {
        status = "pending";
        description = "Will start automatically after previous step.";
      }
    } else if (stage === "Sanctioned") {
      if (isRejected) {
        status = "inactive";
        description = "Not applicable - application was rejected.";
      } else if (isSanctioned || isDisbursed) {
        status = isSanctioned ? "current" : "completed";
        description = isSanctioned ? "Sanction letter issued." : "Sanction completed.";
      } else if (currentIndex > index) {
        status = "completed";
        description = "Completed successfully.";
      } else if (currentIndex === index) {
        status = "current";
        description = "Awaiting sanction.";
      } else {
        status = "pending";
        description = "Will start automatically after previous step.";
      }
    } else if (stage === "Disbursed") {
      if (isRejected) {
        status = "inactive";
        description = "Not applicable - application was rejected.";
      } else if (isDisbursed) {
        status = "completed";
        description = "Funds disbursed successfully.";
      } else if (currentIndex > index) {
        status = "completed";
        description = "Completed successfully.";
      } else if (currentIndex === index) {
        status = "current";
        description = "Disbursement in progress.";
      } else {
        status = "pending";
        description = "Will start automatically after previous step.";
      }
    } else {
      // Regular stages: Application Received, Login Created, Documents Pending, Document Received, Under Credit Evaluation
      if (currentIndex > index) {
        status = "completed";
        description = "Completed successfully.";
      } else if (currentIndex === index) {
        status = "current";
        description = "Waiting for customer action.";
      } else {
        status = "pending";
        description = "Will start automatically after previous step.";
      }
    }

    statuses[stage] = {
      title: stage,
      status,
      description,
    };
  });

  return statuses;
}

function getStageIcon(status: StageStatus) {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={18} />;
    case "current":
      return <Clock3 size={18} />;
    case "inactive":
      return <XCircle size={18} />;
    default:
      return <Circle size={18} />;
  }
}

function getStageStyles(status: StageStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-500 text-white";
    case "current":
      return "bg-amber-500 text-white ring-4 ring-amber-500/20";
    case "inactive":
      return "bg-slate-300 text-slate-500";
    default:
      return "bg-slate-200 text-slate-500";
  }
}

export default function ApplicationTimeline() {
  const { customer } = usePortal();

  if (!customer) return null;

  const stageStatuses = getStageStatuses(customer.application_status);

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
        {TIMELINE_STAGES.map((stage, index) => {
          const stageInfo = stageStatuses[stage];
          const completed = stageInfo.status === "completed";
          const active = stageInfo.status === "current";
          const inactive = stageInfo.status === "inactive";

          return (
            <div
              key={stage}
              className="relative flex gap-5 pb-8 last:pb-0"
            >
              {/* Line */}
              {index !== TIMELINE_STAGES.length - 1 && (
                <>
                  <div className="absolute left-5 top-10 h-[calc(100%-20px)] w-[2px] bg-slate-200" />
                </>
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${getStageStyles(stageInfo.status)}`}
              >
                {getStageIcon(stageInfo.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-semibold text-slate-900 ${active ? "text-lg" : ""}`}>
                    {stageInfo.title}
                  </h3>
                  <span className="text-sm text-slate-500 shrink-0">
                    {stageInfo.status === "completed" ? "Completed" : stageInfo.status === "current" ? "Current" : stageInfo.status === "inactive" ? "N/A" : "Pending"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {stageInfo.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}