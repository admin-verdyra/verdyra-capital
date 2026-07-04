"use client";

import EligibilityForm from "@/components/forms/EligibilityForm";

export default function HeroV2() {
  return (
    <section className="relative min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* LEFT */}

        <div>
          <span className="inline-flex rounded-full border border-[#0F5A3A]/15 bg-[#F3F7F4] px-4 py-2 text-sm font-semibold text-[#0F5A3A]">
            India&apos;s Premium Capital Advisory Platform
          </span>

          <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-[#111111] lg:text-7xl">
            Capital that
            <br />
            moves
            <br />
            businesses
            <span className="text-[#0F5A3A]"> forward.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            Helping Indian businesses secure funding from India&apos;s leading
            Banks & NBFCs — from ₹1 Lakh to ₹25 Crore.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#eligibility"
              className="rounded-full bg-[#0F5A3A] px-8 py-4 font-semibold text-white transition hover:bg-[#0A472F]"
            >
              Get Funded
            </a>

            <a
              href="#partners"
              className="rounded-full border border-[#0F5A3A]/20 px-8 py-4 font-semibold text-[#0F5A3A]"
            >
              Become a Lending Partner
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-700">
            <span>✓ Up to ₹25 Crore</span>

            <span>✓ Starting 8%*</span>

            <span>✓ Fast Digital Process</span>
          </div>
        </div>

        {/* RIGHT */}

        <div>
          <EligibilityForm />
        </div>
      </div>
    </section>
  );
}
