const navItems = [
  { label: "Home", href: "#home" },
  { label: "Funding Solutions", href: "#solutions" },
  { label: "EMI Calculator", href: "#calculator" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] bg-white">
      <div className="mx-auto flex h-[88px] max-w-[1280px] items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <a
          href="#home"
          className="flex w-[420px] flex-shrink-0 items-center"
        >
          <img
            src="/images/logo/logo-horizontal.png"
            alt="Verdyra Capital"
            width={420}
            height={90}
            style={{
              width: "320px",
              height: "auto",
              display: "block",
            }}
          />
        </a>

        {/* Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[16px] font-medium text-[#374151] transition hover:text-[#0F6B47]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-shrink-0 items-center">
          <a
            href="#eligibility"
            className="rounded-full bg-[#0F6B47] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0A5638]"
          >
            Get Funded
          </a>
        </div>

      </div>
    </nav>
  );
}