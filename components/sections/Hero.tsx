import EligibilityForm from '../forms/EligibilityForm';

const benefits = [
  'Interest Rates Starting from 8%',
  'Funding Decisions in as little as 2 Business Days',
  'No Equity Dilution',
  'Dedicated Funding Experts',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAF9] px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,11,0.14),_transparent_44%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-[#0F5A3A]/15 bg-white/80 px-4 py-2 text-sm font-medium text-[#0F5A3A] shadow-sm">
            Premium capital access for modern businesses
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
            Need Capital.
            <span className="block text-[#0F5A3A]">Not Compromise.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Access collateral-free business financing through India&apos;s leading lending institutions.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Business loans, structured debt, revenue-based financing and invoice discounting—all through a single trusted capital partner.
          </p>

          <div className="mt-8 space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-base font-medium text-slate-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F5A3A] text-sm text-white">
                  ✓
                </span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#eligibility"
              className="rounded-full bg-[#0F5A3A] px-7 py-3.5 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
            >
              Check Eligibility
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeT7ZdQ6j1GNoI372-9VWBsFOdejJfgk7NLPnoiRFxBV1OQyg/viewform?usp=publish"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#0F5A3A]/20 bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#0F5A3A] transition duration-300 hover:-translate-y-0.5 hover:border-[#0F5A3A] hover:bg-[#F3F7F4]"
            >
              Become a Lending Partner
            </a>
          </div>
        </div>

        <div className="relative z-10">
          <EligibilityForm />
        </div>
      </div>
    </section>
  );
}
