"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Bell,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/portal/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/portal/documents",
    icon: FolderOpen,
  },
  {
    title: "Notifications",
    href: "/portal/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/portal/profile",
    icon: User,
  },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/portal/auth/logout", {
        method: "POST",
      });

      // Clear cached customer in sessionStorage regardless
      try {
        sessionStorage.removeItem("customer");
      } catch {}

      // Navigate to portal login
      router.push("/portal");
    } catch (err) {
      console.error("Logout failed", err);
      try {
        sessionStorage.removeItem("customer");
      } catch {}
      router.push("/portal");
    }
  }

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-gradient-to-b from-[#0F5A3A] to-[#0A402A] text-white shadow-2xl">

      {/* Logo */}

      <Link
  href="/portal"
  className="block border-b border-white/10 px-8 py-8 transition hover:bg-white/5"
>
  <h1 className="text-3xl font-bold tracking-tight">
    Verdyra
  </h1>

  <p className="mt-2 text-sm text-white/70">
    Customer Portal
  </p>
</Link>

      {/* Navigation */}

      <nav className="flex-1 px-5 py-6">

        <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
          Navigation
        </p>

        <div className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
                  active
                    ? "bg-white text-[#0F5A3A] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">

                  <Icon size={20} />

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
                />

              </Link>
            );
          })}

        </div>

      </nav>

      {/* Footer */}

      <div className="border-t border-white/10 p-6 space-y-3">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-[#0F5A3A] transition hover:scale-[1.02] hover:bg-slate-100"
        >
          <LogOut size={18} />

          Logout
        </button>

        <Link
          href="/"
          className="w-full block text-center rounded-2xl bg-white/5 px-5 py-3 font-medium text-white/90 transition hover:bg-white/10"
        >
          Exit Portal
        </Link>

      </div>

    </aside>
  );
}