"use client";

import type { ReactNode } from "react";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

type PortalShellProps = {
  children: ReactNode;
  customerName?: string;
};

export default function PortalShell({
  children,
  customerName = "Customer",
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-[#F6F8F7]">

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <PortalSidebar />

        {/* Main Area */}

        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Header */}

          <PortalHeader customerName={customerName} />

          {/* Page */}

          <main className="flex-1 overflow-y-auto p-6 lg:p-10">

            <div className="mx-auto w-full max-w-7xl">

              {children}

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}