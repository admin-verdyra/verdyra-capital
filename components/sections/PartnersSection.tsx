const partners = [
  { name: 'InCred', url: 'https://www.incred.com/' },
  { name: 'Indifi', url: 'https://www.indifi.com/' },
  { name: 'GetVantage', url: 'https://www.getvantage.co/' },
  { name: 'FlexiLoans', url: 'https://www.flexiloans.com/' },
  { name: 'Knight Fintech', url: 'https://knightfintech.com/' },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="bg-[#F8FAF9] px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            Lending Partners
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Lending Partners
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Verdyra Capital works with leading Banks, NBFCs and FinTech lenders to help businesses and individuals access the right financing solutions quickly and efficiently.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[22px] border border-slate-200 bg-white p-5 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#0F5A3A] hover:shadow-[0_16px_40px_rgba(15,107,71,0.12)]"
            >
              <div className="flex h-16 items-center justify-center rounded-2xl bg-[#F8FAF9] px-4 text-lg font-semibold tracking-[0.08em] text-[#111111] transition duration-300 group-hover:bg-[#F4F8F5] group-hover:text-[#0F5A3A]">
                {partner.name}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-[#E3C76F]/40 bg-[linear-gradient(135deg,#F8FAF9_0%,#FCF7E8_100%)] p-7 shadow-[0_12px_30px_rgba(17,17,17,0.04)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F5A3A]">
                Become a Lending Partner
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#111111] sm:text-[28px]">
                Become a Lending Partner
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Join Verdyra Capital&apos;s growing financing ecosystem and expand your lending reach by partnering with a technology-driven financing platform that connects quality borrowers with regulated financial institutions.
              </p>
            </div>

            <a
              href="https://forms.gle/FSQerscU1r7r1NY97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
            >
              Become a Lending Partner
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
