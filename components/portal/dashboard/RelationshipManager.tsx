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
    <section id="relationship-manager" className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        Dedicated Support
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Relationship Manager
      </h2>

      <div className="mt-8 flex items-center gap-5">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0F5A3A] to-[#1D7C55] text-3xl font-bold text-white shadow-lg">
          {initials}
        </div>

        <div>

          <h3 className="text-2xl font-bold">
            {rmName}
          </h3>

          <p className="mt-1 text-slate-500">
            Relationship Manager
          </p>

          {rmEmail && (
            <p className="mt-1 text-sm text-slate-500">
              {rmEmail}
            </p>
          )}

          <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            Available
          </span>

        </div>

      </div>

      <div className="mt-8 grid gap-4">

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
