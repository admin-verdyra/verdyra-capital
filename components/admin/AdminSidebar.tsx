"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  GitBranch,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

const baseNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FolderOpen,
  },
  {
    title: "Pipeline",
    href: "/admin/pipeline",
    icon: GitBranch,
  },
];

const superAdminNavItems = [
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type AdminSession = {
  role?: string;
};

export default function AdminSidebar({
  isMobileOpen,
  onClose,
}: {
  isMobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const storedAdmin = sessionStorage.getItem("admin");

      if (!storedAdmin) {
        return;
      }

      const admin = JSON.parse(
        storedAdmin
      ) as AdminSession;

      setIsSuperAdmin(
        admin.role === "Super Admin"
      );
    } catch {
      setIsSuperAdmin(false);
    }
  }, []);

  const navItems = [
    ...baseNavItems,
    ...(isSuperAdmin ? superAdminNavItems : []),
  ];

  async function logout() {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
    });

    sessionStorage.removeItem("admin");
    router.replace("/admin");
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-navigation-drawer"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 shrink-0 flex-col bg-gradient-to-b from-[#0F5A3A] via-[#0F5A3A] to-[#0A402A] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        {isMobileOpen && (
          <div className="lg:hidden flex items-center justify-end p-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <Link
          href="/admin/dashboard"
          className="border-b border-white/10 px-8 py-8 transition hover:bg-white/5 flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]">
              <svg
                className="h-6 w-6 text-[#0F5A3A]"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="#D4AF37"
                />
                <path
                  d="M16 8L22 16L16 24"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Verdyra
              </h1>
              <p className="text-xs text-white/60">
                Admin Portal
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-5 py-6 overflow-y-auto">
          <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
            Navigation
          </p>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
                    active
                      ? "bg-white text-[#0F5A3A] shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      size={20}
                      aria-hidden="true"
                    />

                    <span className="font-medium">
                      {item.title}
                    </span>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`transition ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-6 flex-shrink-0">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-[#0F5A3A] transition hover:scale-[1.02] hover:bg-slate-100"
          >
            <LogOut
              size={18}
              aria-hidden="true"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
