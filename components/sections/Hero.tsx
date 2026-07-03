'use client';

import { useEffect, useState } from 'react';
import EligibilityForm from '../forms/EligibilityForm';

const phrases = [
  'for Growth.',
  'for Expansion.',
  'Without Compromise.',
  'That Moves Business Forward.',
];

const typingPrefix = 'Capital';

const benefits = [
  'Working Capital Finance',
  'Business Term Loans',
  'Invoice Discounting',
  'Revenue-Based Financing',
];

const trustPoints = [
  'Funding up to ₹25 Crore',
  'Fast Digital Process',
  'Dedicated Capital Advisory',
  'Leading Banking & NBFC Network',
];

export default function Hero() {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const currentText = phrases[phraseIndex];

    if (phase === 'typing') {
      if (currentPhrase.length < currentText.length) {
        const timeout = window.setTimeout(() => {
          setCurrentPhrase(currentText.slice(0, currentPhrase.length + 1));
        }, 70);

        return () => window.clearTimeout(timeout);
      }

      const timeout = window.setTimeout(() => {
        setPhase('deleting');
      }, 1600);

      return () => window.clearTimeout(timeout);
    }

    if (currentPhrase.length > 0) {
      const timeout = window.setTimeout(() => {
        setCurrentPhrase(currentText.slice(0, currentPhrase.length - 1));
      }, 45);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setPhraseIndex((value) => (value + 1) % phrases.length);
      setPhase('typing');
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [currentPhrase, phase, phraseIndex]);

  return (
    <section id="home" className="relative overflow-hidden bg-[#F8FAF9] px-6 pb-10 pt-20 sm:px-8 lg:px-10 lg:pb-12 lg:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,11,0.14),_transparent_44%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-14">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-[#0F5A3A]/15 bg-white/80 px-4 py-2 text-sm font-medium text-[#0F5A3A] shadow-sm backdrop-blur-sm">
            Fast. Simple. Reliable Finance.
          </div>

          <div className="mt-6 rounded-[28px] border border-[#0F5A3A]/10 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,90,58,0.08)] backdrop-blur-sm sm:p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B8860B] sm:text-xs">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#B8860B]" />
              Smart Financing Solutions
            </div>
            <div className="mt-4 min-h-[3.25rem] text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl lg:text-[2.2rem]">
              <span className="transition-all duration-500">{typingPrefix} {currentPhrase}</span>
              <span className="ml-1 inline-block h-[1.05em] w-[0.55ch] animate-pulse rounded-sm bg-[#0F5A3A] align-middle" />
            </div>
          </div>

         <div className="mt-6 rounded-[32px] bg-gradient-to-r from-[#0F5A3A] to-[#146A47] p-6 text-white shadow-[0_24px_70px_rgba(15,90,58,0.20)]">

  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#F2D58E]">
    India's Growth Capital Platform
  </p>

  <div className="mt-4 flex items-center gap-3">
    <span className="text-3xl font-bold sm:text-5xl">
      ₹1L
    </span>

    <span className="text-2xl text-[#F2D58E]">
      →
    </span>

    <span className="text-3xl font-bold sm:text-5xl">
      ₹25Cr
    </span>
  </div>

  <div className="mt-5 flex flex-wrap gap-3">

    <div className="mt-5 flex flex-wrap gap-3">
  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
    Starting from 8%*
  </div>

  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
    Collateral-Free Loans
  </div>

  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
    Disbursal in 2 Days
  </div>
</div>
  </div>

</div>

          <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
            Need Capital.
            <span className="block text-[#0F5A3A]">Not Compromise.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Helping Indian businesses secure tailored financing solutions through leading Banks and NBFCs with dedicated capital advisory.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F5A3A] text-sm text-white">
                  ✓
                </span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-[24px] border border-[#0F5A3A]/10 bg-white/80 p-4 shadow-[0_16px_48px_rgba(15,90,58,0.06)] sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-2xl bg-[#F8FAF9] px-3 py-3 text-center text-sm font-medium text-[#0F5A3A]">
                {point}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            *Interest rates are indicative and subject to the applicant&apos;s credit profile, business eligibility, lender approval and prevailing market conditions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#eligibility"
              className="w-full sm:w-auto block rounded-full bg-[#0F5A3A] px-7 py-3.5 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
            >
              Get Funded
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeT7ZdQ6j1GNoI372-9VWBsFOdejJfgk7NLPnoiRFxBV1OQyg/viewform?usp=publish"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto block rounded-full border border-[#0F5A3A]/20 bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#0F5A3A] transition duration-300 hover:-translate-y-0.5 hover:border-[#0F5A3A] hover:bg-[#F3F7F4]"
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
