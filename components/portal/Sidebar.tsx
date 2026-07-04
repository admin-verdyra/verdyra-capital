"use client";

import type { Customer } from "./types";

type ActiveView = "dashboard" | "documents";

type SidebarProps = {
  customer: Customer;
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onLogout: () => void;
};

const menuItems = [
  {
    id: "dashboard" as const,
    label: "Dashboard",
    icon: "🏠",
  },
  {
    id: "documents" as const,
    label: "Documents",
    icon: "📄",
  },
];

export default function Sidebar({
  customer,
  activeView,
  onChangeView,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="flex h-[90vh] flex-col border-r border-slate-200 bg-[#F8FAF9]">

      <div className="border-b border-slate-200 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
          Customer Portal
        </p>

        <h2 className="mt-3 text-2xl font-bold text-[#111111]">
          Welcome,
        </h2>

        <p className="mt-1 text-lg font-semibold text-[#0F5A3A]">
          {customer.full_name}
        </p>

      </div>

      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item) => {

          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeView(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#0F5A3A] text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-[#EDF7F2]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              {item.label}
            </button>
          );
        })}

      </nav>

      <div className="border-t border-slate-200 p-4">

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}