const solutions = [
  'Business Loan Providers',
  'NBFC Network',
  'Revenue-Based Financing',
  'Invoice Financing',
  'Structured Debt',
  'Personal Lending',
];

export default function LendingNetwork() {
  return (
    <section className="bg-[#F8FAF9] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            Financing Ecosystem
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Financing Ecosystem
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Verdyra Capital helps businesses access financing solutions through a network of banks, NBFCs and alternative financing institutions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <div
              key={solution}
              className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-6 text-center text-lg font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B8860B]/40 hover:shadow-[0_20px_55px_rgba(184,134,11,0.14)]"
            >
              {solution}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] border border-slate-200 bg-[#F8FAF9] p-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-lg font-medium text-slate-700">Interested in working with Verdyra?</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeT7ZdQ6j1GNoI372-9VWBsFOdejJfgk7NLPnoiRFxBV1OQyg/viewform?usp=publish"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f] sm:mt-0"
          >
            Become a Lending Partner
          </a>
        </div>
      </div>
    </section>
  );
}
