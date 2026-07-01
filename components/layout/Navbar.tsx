'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Funding Solutions', href: '#solutions' },
  { label: 'Partners', href: '#partners' },
  { label: 'EMI Calculator', href: '#calculator' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const targetId = hash.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [pathname]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!isHomePage) {
      return;
    }

    event.preventDefault();
    const target = document.getElementById(hash.replace('#', ''));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', hash);
    }
  };

  const getHref = (hash: string) => (isHomePage ? hash : `/${hash}`);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex h-[88px] max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <Link
          href={getHref('#home')}
          onClick={(event) => handleClick(event, '#home')}
          className="flex w-[420px] flex-shrink-0 items-center"
        >
          <img
            src="/images/logo/logo-horizontal.png"
            alt="Verdyra Capital"
            width={420}
            height={90}
            style={{
              width: '320px',
              height: 'auto',
              display: 'block',
            }}
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={getHref(item.href)}
              onClick={(event) => handleClick(event, item.href)}
              className="text-[16px] font-medium text-[#374151] transition hover:text-[#0F6B47]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/80 text-[#374151] shadow-sm ring-1 ring-[#E6E6E6]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-shrink-0 items-center">
          <Link
            href={getHref('#eligibility')}
            onClick={(event) => handleClick(event, '#eligibility')}
            className="rounded-full bg-[#0F6B47] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0A5638]"
          >
            Get Funded
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-4 top-20 w-[88%] max-w-[320px] rounded-xl bg-white p-4 shadow-xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={getHref(item.href)}
                  onClick={(event) => {
                    handleClick(event, item.href);
                    setOpen(false);
                  }}
                  className="block rounded-md px-3 py-3 text-base font-medium text-[#374151] hover:bg-[#F3F7F4]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={getHref('#eligibility')}
                onClick={(event) => {
                  handleClick(event, '#eligibility');
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