"use client";

import { Bell, Menu, Search } from "lucide-react";

type PortalHeaderProps = {
  customerName?: string;
  onMenuClick?: () => void;
};

export default function PortalHeader({
  customerName = "Customer",
  onMenuClick,
}: PortalHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const initials = customerName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">

      <div className="flex h-20 items-center justify-between px-6 lg:px-10">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>

            <p className="text-sm text-slate-500">
              {greeting}
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              {customerName} 👋
            </h1>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button className="rounded-xl p-3 transition hover:bg-slate-100">
            <Search size={20} />
          </button>

          <button className="relative rounded-xl p-3 transition hover:bg-slate-100">

            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />

          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5A3A] font-semibold text-white shadow">

            {initials}

          </div>

        </div>

      </div>

    </header>
  );
}