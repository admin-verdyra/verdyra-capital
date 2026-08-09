"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut, User } from "lucide-react";

type PortalHeaderProps = {
  customerName?: string;
  onMenuClick?: () => void;
};

export default function PortalHeader({
  customerName = "Customer",
  onMenuClick,
}: PortalHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = customerName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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

  function handleProfileClick() {
    router.push("/portal/profile");
    setIsMenuOpen(false);
  }

  function handleLogoutClick() {
    setIsMenuOpen(false);
    handleLogout();
  }

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

          <div className="hidden lg:block">

            <h1 className="text-2xl font-bold text-slate-900">
              {customerName}
            </h1>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button className="rounded-xl p-3 transition hover:bg-slate-100">
            <Search size={20} />
          </button>

          {/* Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5A3A] font-semibold text-white shadow transition hover:opacity-90"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              {initials}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right animate-in fade-in-0 zoom-in-95 transition-all duration-150">
                <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <button
                    onClick={handleProfileClick}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <User size={16} className="text-slate-400" />
                    Profile
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
}
