"use client";

import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F8F7]">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="min-w-0 flex-1 flex flex-col lg:pl-0">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px] min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}