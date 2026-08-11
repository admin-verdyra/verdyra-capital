"use client";

import {
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

import type { Customer } from "@/components/portal/types";

type Props = {
  customer: Customer;
};

export default function RelationshipManager({
  customer,
}: Props) {
  const rmName = customer.relationship_manager || "Relationship Manager";
  const rmEmail = customer.relationship_manager_email;
  const rmPhone = customer.relationship_manager_phone;

  const initials = rmName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleCall() {
    if (rmPhone) {
      window.location.href = `tel:${rmPhone}`;
    }
  }

  function handleEmail() {
    if (rmEmail) {
      window.location.href = `mailto:${rmEmail}`;
    }
  }

  function handleWhatsApp() {
    if (rmPhone) {
      const cleanPhone = rmPhone.replace(/\D/g, "");
      window.location.href = `https://wa.me/${cleanPhone}`;
    }
  }

  return (
    <section id="relationship-manager" className="rounded-[30px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        Dedicated Support
      </p>

      <h2 className="mt-2 text-xl md:text-2xl font-bold text-slate-900">
        Relationship Manager
      </h2>

      <div className="mt-8 flex items-center gap-5">

        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0F5A3A] to-[#1D7C55] text-2xl md:text-3xl font-bold text-white shadow-lg">
          {initials}
        </div>

        <div className="min-w-0">

          <h3 className="text-xl md:text-2xl font-bold truncate">
            {rmName}
          </h3>

          <p className="mt-1 text-slate-500">
            Relationship Manager
          </p>

          {rmEmail && (
            <a
              href={`mailto:${rmEmail}`}
              className="mt-1 text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
            >
              {rmEmail}
            </a>
          )}

          {rmPhone && (
            <a
              href={`tel:${rmPhone}`}
              className="mt-1 text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
            >
              {rmPhone}
            </a>
          )}

          <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            Contact your Relationship Manager
          </span>

        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <button
          onClick={handleCall}
          disabled={!rmPhone}
          className="flex items-center justify-center gap-3 rounded-2xl bg-[#0F5A3A] px-6 py-4 font-semibold text-white transition hover:bg-[#0C4C31] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone size={20} />

          Call Relationship Manager

        </button>

        <button
          onClick={handleEmail}
          disabled={!rmEmail}
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail size={20} />

          Send Email

        </button>

        <button
          onClick={handleWhatsApp}
          disabled={!rmPhone}
          className="flex items-center justify-center gap-3 rounded-2xl border border-[#25D366] bg-[#25D366]/10 px-6 py-4 font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle size={20} />

          WhatsApp

        </button>

      </div>

    </section>
  );
}
