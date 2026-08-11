"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

const navItems = [
  {
    title: "Dashboard",
    href: "/portal/dashboard",
  },
  {
    title: "Documents",
    href: "/portal/documents",
  },
  {
    title: "Profile",
    href: "/portal/profile",
  },
];

type PortalShellProps = {
  children: ReactNode;
  customerName?: string;
};

export default function PortalShell({
  children,
  customerName = "Customer",
}: PortalShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <PortalSidebar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <PortalHeader
            customerName={customerName}
            onMenuClick={openMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div
              id="mobile-navigation-drawer"
              className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={closeMobileMenu}
                aria-hidden="true"
              />

              {/* Drawer */}
              <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                {/* Header */}
                <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
                  <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="rounded-xl p-2 transition hover:bg-slate-100"
                    aria-label="Close menu"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-600"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Navigation */}
                <nav className="px-5 py-6">
                  <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Navigation
                  </p>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-slate-700 transition hover:bg-slate-100"
                      >
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </aside>
            </div>
          )}

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
