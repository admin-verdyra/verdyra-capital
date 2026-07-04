"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import CustomerPortal from "@/components/portal/CustomerPortal";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Funding Solutions", href: "#solutions" },
  { label: "Partners", href: "#partners" },
  { label: "EMI Calculator", href: "#calculator" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const target = document.getElementById(hash.replace("#", ""));
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [pathname]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!isHomePage) return;

    event.preventDefault();
    const target = document.getElementById(hash.replace("#", ""));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", hash);
    }
  };

  const getHref = (hash: string) => (isHomePage ? hash : `/${hash}`);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-8">
        <Link
          href={getHref("#home")}
          onClick={(e) => handleClick(e, "#home")}
          className="flex flex-shrink-0 items-center"
        >
          <img
            src="/images/logo/logo-horizontal.png"
            alt="Verdyra Capital"
            width={420}
            height={90}
            style={{ width: "285px", height: "auto", display: "block" }}
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={getHref(item.href)}
              onClick={(e) => handleClick(e, item.href)}
              className="text-[15px] font-medium text-[#374151] transition hover:text-[#0F6B47]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <CustomerPortal />

          <Link
            href={getHref("#eligibility")}
            onClick={(e) => handleClick(e, "#eligibility")}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0F6B47] px-6 text-[15px] font-semibold text-white transition hover:bg-[#0A5638]"
          >
            Get Funded
          </Link>
        </div>

        <div className="flex items-center lg:hidden">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#374151] shadow-sm ring-1 ring-[#E6E6E6]"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-4 top-20 w-[88%] max-w-[320px] rounded-xl bg-white p-4 shadow-xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={getHref(item.href)}
                  onClick={(e) => {
                    handleClick(e, item.href);
                    setOpen(false);
                  }}
                  className="block rounded-md px-3 py-3 text-base font-medium text-[#374151] hover:bg-[#F3F7F4]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={getHref("#eligibility")}
                onClick={(e) => {
                  handleClick(e, "#eligibility");
                  setOpen(false);
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#0F6B47] px-4 py-3 text-sm font-semibold text-white"
              >
                Get Funded
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
