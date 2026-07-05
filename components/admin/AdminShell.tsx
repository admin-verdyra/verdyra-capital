"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AdminShell({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#F6F8F7]">

      <div className="flex">

        {/* Sidebar */}

        <AdminSidebar />

        {/* Main */}

        <div className="flex min-h-screen flex-1 flex-col">

          <AdminHeader
            title={title}
            subtitle={subtitle}
          />

          <main className="flex-1 p-8">

            <div className="mx-auto max-w-[1600px]">

              {children}

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}