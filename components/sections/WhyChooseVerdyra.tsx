const reasons = [
  'Specialist support for growing businesses and individuals.',
  'Fast decisions with premium advisory and lending access.',
  'Tailored capital strategies that fit your growth stage.',
];

export default function WhyChooseVerdyra() {
  return (
    <section className="bg-[#F8FAF9] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            Why Choose Verdyra
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Premium capital guidance for ambitious plans.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Verdyra combines lending access, advisory depth, and fast execution so you can move from opportunity to funding with confidence.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason} className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F5A3A]/10 text-[#0F5A3A]">
                ✓
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
