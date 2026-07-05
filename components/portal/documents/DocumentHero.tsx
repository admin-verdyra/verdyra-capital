"use client";

import { ShieldCheck } from "lucide-react";

export default function DocumentHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F5A3A] via-[#166B47] to-[#1D7C55] p-10 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.25em] text-white/70">
            Secure Upload
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Documents
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Upload your KYC and financial documents securely.
            Every document is encrypted and reviewed by your
            Relationship Manager.
          </p>

        </div>

        <div className="hidden rounded-3xl bg-white/10 p-8 backdrop-blur lg:flex">

          <ShieldCheck
            size={72}
            strokeWidth={1.5}
          />

        </div>

      </div>

    </section>
  );
}