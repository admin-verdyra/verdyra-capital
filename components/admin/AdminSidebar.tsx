"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  GitBranch,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useRouter } from "next/navigation";

const navItems = [
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
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

function logout() {
  sessionStorage.removeItem("admin");
  router.replace("/admin");
}

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl">

      <Link
        href="/admin/dashboard"
        className="border-b border-white/10 px-8 py-8 transition hover:bg-white/5"
      >
        <h1 className="text-3xl font-bold">
          Verdyra
        </h1>

        <p className="mt-2 text-sm text-white/60">
          Admin Portal
        </p>
      </Link>

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
                    ? "bg-white text-slate-900 shadow-lg"
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

      <div className="border-t border-white/10 p-6">

  <button
    onClick={logout}
    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-slate-900 transition hover:scale-[1.02]"
  >
    <LogOut size={18} />

    Logout

  </button>

</div>
</aside>
  );
}