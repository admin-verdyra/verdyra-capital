'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type MouseEvent } from 'react';

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
    </nav>
  );
}