"use client";

import type { Customer } from "./types";
import ProfileCard from "./ProfileCard";

import {
  DashboardHero,
  DashboardStats,
  ApplicationTimeline,
  RecentActivity,
  RelationshipManager,
  QuickActions,
} from "./dashboard";

type Props = {
  customer: Customer;
};

export default function DashboardView({
  customer,
}: Props) {
  return (
    <div className="space-y-8">
      <DashboardHero customer={customer} />

      <DashboardStats customer={customer} />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ApplicationTimeline />
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <RelationshipManager />

        <QuickActions />
      </div>

      <ProfileCard customer={customer} />
    </div>
  );
}