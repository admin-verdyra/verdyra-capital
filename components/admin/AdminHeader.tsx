"use client";

import {
  Bell,
  Search,
  UserCircle2,
  ChevronDown,
} from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function AdminHeader({
  title,
  subtitle,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">

      <div className="flex items-center justify-between px-8 py-6">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* Search */}

          <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 w-80">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              placeholder="Search customers..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Notifications */}

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 transition hover:bg-slate-50">

            <Bell size={20} />

            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />

          </button>

          {/* Admin */}

          <button className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2 transition hover:bg-slate-50">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5A3A] text-white">

              <UserCircle2 size={24} />

            </div>

            <div className="hidden text-left xl:block">

              <p className="text-sm font-semibold text-slate-900">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                Verdyra Capital
              </p>

            </div>

            <ChevronDown
              size={18}
              className="text-slate-500"
            />

          </button>

        </div>

      </div>

    </header>
  );
}