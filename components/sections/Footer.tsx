import Image from 'next/image';

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-and-conditions' },
  { label: 'Disclaimer', href: '/disclaimer' },
];
const services = ['Business Loans', 'Revenue Based Financing', 'Invoice Discounting', 'Structured Debt'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#111111] px-6 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="max-w-md">
          <Image
            src="/images/logo/logo-horizontal.png"
            alt="Verdyra Capital"
            width={220}
            height={60}
            className="h-auto w-[170px] sm:w-[220px]"
          />
          <p className="mt-3 text-sm text-slate-300">
            Brand of Verdyra Fintech Private Limited
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-300">
            <p className="font-medium text-white">Email</p>
            <a href="mailto:connect@verdyracapital.in" className="transition hover:text-[#B8860B]">
              connect@verdyracapital.in
            </a>
            <p className="pt-2 font-medium text-white">Website</p>
            <a href="http://www.verdyracapital.in/" target="_blank" rel="noreferrer" className="transition hover:text-[#B8860B]">
              www.verdyracapital.in
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Services
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Quick Links
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-[#B8860B]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Verdyra Fintech Private Limited. All Rights Reserved.</p>
        <p>Verdyra Capital</p>
      </div>
    </footer>
  );
}
