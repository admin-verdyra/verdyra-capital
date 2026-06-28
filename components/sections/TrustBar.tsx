const stats = [
  { value: '₹100+ Crores', label: 'Disbursed', icon: '₹' },
  { value: '500+', label: 'Brands Funded', icon: '◌' },
  { value: '5+', label: 'Lending Partners', icon: '⌁' },
  { value: '98%', label: 'Application Assistance', icon: '✓' },
  { value: '10+ Years', label: 'Lending Experience', icon: '✦' },
];

export default function TrustBar() {
  return (
    <section className="border-t border-[#0F5A3A]/10 bg-[#F8FAF9] px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B8860B]/40 hover:shadow-[0_20px_55px_rgba(184,134,11,0.14)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5A3A]/10 text-lg font-semibold text-[#0F5A3A] transition duration-300 group-hover:bg-[#B8860B]/15 group-hover:text-[#B8860B]">
              {stat.icon}
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-[#111111]">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-[#0F5A3A] transition duration-300 group-hover:text-[#B8860B]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
