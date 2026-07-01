const solutions = [
  {
    title: 'Business Loans',
    description:
      'Flexible secured and unsecured financing for business expansion and working capital.',
    idealFor: 'Growing businesses.',
    icon: '↗',
  },
  {
    title: 'Revenue Based Financing',
    description:
      'Raise growth capital based on revenue without diluting equity.',
    idealFor: 'D2C Brands and E-commerce Sellers.',
    icon: '◔',
  },
  {
    title: 'Invoice Discounting',
    description: 'Unlock cash tied up in unpaid invoices.',
    idealFor: 'Manufacturers and B2B Businesses.',
    icon: '◫',
  },
  {
    title: 'Structured Debt Solutions',
    description: 'Tailored debt solutions for larger funding requirements.',
    idealFor: 'Growth-stage companies.',
    icon: '◌',
  },
  {
    title: 'Secured Loans',
    description: 'Asset-backed financing with competitive interest rates.',
    idealFor: 'Businesses seeking larger ticket sizes.',
    icon: '◍',
  },
  {
    title: 'Personal Loans',
    description: 'Quick personal financing with flexible repayment options.',
    idealFor: 'Salaried and self-employed individuals.',
    icon: '✦',
  },
];

export default function CapitalSolutions() {
  return (
    <section id="solutions" className="bg-white px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            Capital Solutions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Capital Solutions for Every Stage of Growth
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Whether you&apos;re scaling your business, managing working capital, or looking for personal financing, Verdyra connects you with the right lending partner.
          </p>
        </div>

        <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-[0_16px_45px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B8860B]/40 hover:shadow-[0_20px_55px_rgba(184,134,11,0.14)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F5A3A]/10 text-xl font-semibold text-[#0F5A3A] transition duration-300 group-hover:bg-[#B8860B]/15 group-hover:text-[#B8860B]">
                {solution.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#111111]">
                {solution.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {solution.description}
              </p>
              <div className="mt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5A3A]">
                  Ideal For
                </p>
                <p className="mt-2 text-sm text-slate-700">{solution.idealFor}</p>
              </div>
              <a
                href="#eligibility"
                className="mt-6 block w-full text-center sm:inline-flex sm:w-auto items-center text-sm font-semibold text-[#0F5A3A] transition duration-300 group-hover:text-[#B8860B] py-2"
              >
                Learn More
                <span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
