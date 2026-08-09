"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, UserCircle2, ChevronDown, LogOut } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  isMobileMenuOpen?: boolean;
};

export default function AdminHeader({
  title,
  subtitle,
  onMenuClick,
  isMobileMenuOpen = false,
}: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get admin info from sessionStorage
  const [admin, setAdmin] = useState<{
    full_name: string;
    email: string | null;
    role: string;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("admin");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdmin({
          full_name: parsed.full_name,
          email: parsed.email,
          role: parsed.role,
        });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

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
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      sessionStorage.removeItem("admin");
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed", err);
      sessionStorage.removeItem("admin");
      router.push("/admin");
    }
  }

  function handleLogoutClick() {
    setIsMenuOpen(false);
    handleLogout();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Admin Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-50"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="Account menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F5A3A] text-white">
                <UserCircle2 size={22} aria-hidden="true" />
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold text-slate-900">
                  {admin?.full_name ?? "Administrator"}
                </p>
                <p className="text-xs text-slate-500">Verdyra Capital</p>
              </div>

              <ChevronDown size={18} className="text-slate-500" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right animate-in fade-in-0 zoom-in-95 transition-all duration-150">
                <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">
                      {admin?.full_name ?? "Administrator"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {admin?.email ?? "admin@verdyracapital.in"}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {admin?.role?.toLowerCase() ?? "admin"}
                    </p>
                  </div>

                  <div className="border-t border-slate-100" />

                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} aria-hidden="true" />
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