import Image from 'next/image';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Funding Solutions', href: '#solutions' },
  { label: 'EMI Calculator', href: '#calculator' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex w-[250px] flex-shrink-0 items-center">
          <Image
            src="/images/logo/logo-horizontal.png"
            alt="Verdyra Capital"
            width={240}
            height={48}
            priority
            className="h-[48px] w-auto object-contain"
          />
        </a>

        <div className="hidden flex-1 flex-nowrap items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-[16px] font-medium text-[#374151] transition hover:text-[#0F6B47]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center justify-end">
          <a
            href="#eligibility"
            className="rounded-full bg-[#0F6B47] px-[22px] py-[11px] text-[15px] font-semibold text-white transition hover:bg-[#0A5638]"
          >
            Check Eligibility
          </a>
        </div>
      </div>
    </nav>
  );
}