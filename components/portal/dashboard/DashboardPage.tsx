"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import ProfileCard from "@/components/portal/ProfileCard";

import {
  DashboardHero,
  DashboardStats,
  ApplicationTimeline,
  RecentActivity,
  RelationshipManager,
  QuickActions,
} from "./index";

export default function DashboardPage() {
  const { customer } = usePortal();

  if (!customer) return null;

  return (
    <div className="space-y-8">
      <DashboardHero customer={customer} />

      <QuickActions />

      <DashboardStats customer={customer} />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ApplicationTimeline />
        </div>

        <RecentActivity />
      </div>

      <RelationshipManager customer={customer} />

      <ProfileCard customer={customer} />
    </div>
  );
}
