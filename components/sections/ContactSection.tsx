export default function ContactSection() {
  return (
    <section className="bg-[#F8FAF9] px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="w-full">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            Advisory Support
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Talk to Our Capital Advisors
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Whether you need business funding, structured debt, revenue-based financing or invoice discounting, our advisory team is here to guide you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:connect@verdyracapital.in?subject=Schedule%20a%20Call"
              className="inline-flex items-center justify-center rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
            >
              Schedule a Call
            </a>
            <a
              href="mailto:connect@verdyracapital.in"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition duration-300 hover:border-[#0F5A3A] hover:text-[#0F5A3A]"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-[#F8FAF9] p-7">
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <p className="text-base font-semibold text-[#111111]">Email</p>
              <a href="mailto:connect@verdyracapital.in" className="mt-2 inline-flex items-center gap-2 text-[#0F5A3A] transition hover:text-[#B8860B]">
                <span>📧</span>
                <span>connect@verdyracapital.in</span>
              </a>
            </div>

            <div>
              <p className="text-base font-semibold text-[#111111]">Business Hours</p>
              <p className="mt-2">Monday–Saturday</p>
              <p>9:30 AM–6:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
