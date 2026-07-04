"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PortalProvider } from "@/components/portal/PortalProvider";
import AuthGuard from "@/components/portal/AuthGuard";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/portal/dashboard",
    },
    {
      name: "Documents",
      href: "/portal/documents",
    },
    {
      name: "Profile",
      href: "/portal/profile",
    },
    {
      name: "Notifications",
      href: "/portal/notifications",
    },
  ];

  return (
    <PortalProvider>
      <AuthGuard>
        <div className="min-h-screen bg-[#F6F8F7]">
          <div className="flex min-h-screen">
            {/* Sidebar */}

            <aside className="hidden w-72 flex-col bg-[#0F5A3A] text-white lg:flex">
              <div className="border-b border-white/10 p-8">
                <h1 className="text-3xl font-bold">
                  Verdyra
                </h1>

                <p className="mt-2 text-sm text-white/70">
                  Customer Portal
                </p>
              </div>

              <nav className="flex-1 space-y-3 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-5 py-4 transition ${
                      pathname === item.href
                        ? "bg-white font-semibold text-[#0F5A3A]"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-white/10 p-6">
                <Link
                  href="/"
                  className="block rounded-xl bg-white px-5 py-4 text-center font-semibold text-[#0F5A3A] transition hover:bg-slate-100"
                >
                  Exit Portal
                </Link>
              </div>
            </aside>

            {/* Main Content */}

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </PortalProvider>
  );
}