"use client";

import Image from "next/image";

const partners = [
  {
    name: "InCred",
    logo: "/images/partners/incred.png",
  },
  {
    name: "Indifi",
    logo: "/images/partners/indifi.png",
  },
  {
    name: "GetVantage",
    logo: "/images/partners/getvantage.png",
  },
  {
    name: "FlexiLoans",
    logo: "/images/partners/flexiloans.png",
  },
  {
    name: "Knight Fintech",
    logo: "/images/partners/knightfintech.png",
  },
];

const trustIndicators = [
  { title: "Trusted Lending Partners", icon: "✓" },
  { title: "Nationwide Coverage", icon: "◌" },
  { title: "Fast Digital Processing", icon: "⚡" },
];

export default function PartnersSection() {
  return (
    <section
      id="partners"
      className="bg-[#F8FAF9] px-6 py-14 sm:px-8 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
            Our Lending Ecosystem
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Powering Growth Through Trusted Lending Partners
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Access financing through India&apos;s trusted Banks, NBFCs and
            FinTech lending partners—helping businesses and individuals secure
            the right capital with speed and confidence.
          </p>
        </div>

        <div className="mt-10 overflow-hidden">
          <div className="partnerCarousel relative">
            <div className="scrollTrack flex items-stretch gap-4">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="group w-[260px] h-[340px] flex flex-col items-center justify-center rounded-[22px] border border-slate-200 bg-white p-5 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_18px_42px_rgba(17,17,17,0.16)] hover:scale-[1.03] hover:border-[#0F5A3A]"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-2">
                    <div className="flex h-[180px] w-full items-center justify-center rounded-2xl bg-[#F8FAF9] px-6 transition duration-300 group-hover:bg-[#F4F8F5]">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={160}
                        height={80}
                        className="w-[88%] max-h-full h-auto object-contain transition duration-300 group-hover:brightness-105"
                      />
                    </div>
                    <div className="h-[44px] flex items-center justify-center text-[18px] font-semibold text-[#111111]">
                      {partner.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                Join Verdyra Capital&apos;s growing financing ecosystem and
                expand your lending reach by partnering with a technology-driven
                financing platform that connects quality borrowers with
                regulated financial institutions.
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

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {trustIndicators.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-[0_6px_20px_rgba(17,17,17,0.03)]"
            >
              <span className="text-base text-[#B8860B]">
                {item.icon}
              </span>

              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .partnerCarousel {
          overflow: hidden;
        }

        .scrollTrack {
          display: flex;
          gap: 1rem;
          min-width: max-content;
          animation: scrollLeft 28s linear infinite;
        }

        .partnerCarousel:hover .scrollTrack {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}