import type { ReactNode } from 'react';

const contactItems = [
  {
    title: 'Email',
    value: 'connect@verdyracapital.in',
    href: 'mailto:connect@verdyracapital.in',
    icon: 'email' as const,
  },
  {
    title: 'Phone',
    value: '+91 7011206752',
    href: 'tel:+917011206752',
    icon: 'phone' as const,
  },
  {
    title: 'Registered Office',
    value: 'A100, First Floor\nBlock A, Sushant Lok Phase – 3\nGurugram – 122003\nHaryana, India',
    href: 'https://maps.google.com/?q=Verdyra+Fintech+Private+Limited',
    icon: 'office' as const,
  },
  {
    title: 'Corporate Office',
    value: '4th Floor, Magnum Towers\nGolf Course Extension Road\nSector 58\nGurugram – 122011\nHaryana, India',
    href: 'https://maps.google.com/?q=Verdyra+Fintech+Private+Limited',
    icon: 'office' as const,
  },
  {
    title: 'Working Hours',
    value: 'Monday – Saturday\n9:30 AM – 6:30 PM',
    href: '#home',
    icon: 'hours' as const,
  },
];

function ContactIcon({ type }: { type: 'phone' | 'email' | 'office' | 'hours' }) {
  const commonClassName = 'h-5 w-5';

  const icons: Record<'phone' | 'email' | 'office' | 'hours', ReactNode> = {
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={commonClassName}>
        <path d="M5.75 4.75h2.5a1 1 0 0 1 .97.79l.55 2.2a1 1 0 0 1-.24.95l-1.2 1.2a13.2 13.2 0 0 0 5.6 5.6l1.2-1.2a1 1 0 0 1 .95-.24l2.2.55a1 1 0 0 1 .79.97v2.5a1 1 0 0 1-1 1A15.75 15.75 0 0 1 4.75 4.75a1 1 0 0 1 1-1Z" />
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={commonClassName}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    ),
    office: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={commonClassName}>
        <path d="M5 20V8.5a1 1 0 0 1 .6-.92l6-3a1 1 0 0 1 .8 0l6 3A1 1 0 0 1 19 8.5V20" />
        <path d="M9 20v-4h6v4" />
        <path d="M9 11h6" />
        <path d="M9 14h6" />
      </svg>
    ),
    hours: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={commonClassName}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2.5" />
      </svg>
    ),
  };

  return <span className="flex items-center justify-center">{icons[type]}</span>;
}

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#F8FAF9] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Looking for the right financing solution? Our specialists are ready to help you identify the most suitable funding options for your business or personal financial requirements.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#eligibility"
                className="inline-flex items-center justify-center rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
              >
                Get Funded
              </a>
              <a
                href="tel:+917011206752"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition duration-300 hover:border-[#0F5A3A] hover:text-[#0F5A3A]"
              >
                Call Us
              </a>
              <a
                href="mailto:connect@verdyracapital.in"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition duration-300 hover:border-[#0F5A3A] hover:text-[#0F5A3A]"
              >
                Email Us
              </a>
            </div>

            <div className="mt-10 rounded-[24px] border border-slate-200 bg-[#F8FAF9] p-6">
              <p className="text-base font-semibold text-[#111111]">
                Helping businesses and individuals access the right financing through India&apos;s leading Banks, NBFCs and other regulated financial institutions.
              </p>
              <p className="mt-3 text-sm font-medium text-[#0F5A3A]">
                Fast. Transparent. Reliable.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-[#F8FAF9] p-7">
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-base font-semibold text-[#111111]">Verdyra Fintech Private Limited</p>
              </div>
              {contactItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E3C76F]/40 bg-[#F7F1D8] text-[#0F5A3A]">
                    <ContactIcon type={item.icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#111111]">{item.title}</p>
                    <a
                      href={item.href}
                      className="mt-2 inline-flex text-[#0F5A3A] transition hover:text-[#B8860B]"
                    >
                      <span className="whitespace-pre-line">{item.value}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
