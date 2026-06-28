const pillars = [
  {
    title: 'Trusted Advisory',
    description: 'Expert guidance that simplifies the funding journey and aligns capital solutions with your goals.',
  },
  {
    title: 'Faster Decisions',
    description: 'Streamlined support and lender coordination that helps accelerate funding conversations.',
  },
  {
    title: 'Tailored Financing',
    description: 'Financing pathways designed around your business stage, revenue profile, and growth plans.',
  },
];

export default function AboutVerdyra() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            About Verdyra Capital
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            About Verdyra Capital
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Verdyra Capital is a fintech financing platform helping MSMEs, founders and individuals access the right funding from India&apos;s leading Banks, NBFCs and other regulated financial institutions.
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            We simplify the financing journey by understanding every customer&apos;s funding requirement and connecting them with lending solutions that best match their profile and business needs.
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Whether it is working capital, unsecured business loans, machinery finance, invoice discounting, expansion capital or structured debt, our technology-driven platform helps customers identify and access suitable financing solutions quickly and efficiently.
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Our mission is simple: To help businesses and individuals access the right capital at competitive interest rates through trusted regulated financial institutions across India.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[24px] border border-slate-200 bg-[#F8FAF9] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B8860B]/40 hover:shadow-[0_20px_55px_rgba(184,134,11,0.14)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5A3A]/10 text-[#0F5A3A]">
                ✦
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#111111]">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
