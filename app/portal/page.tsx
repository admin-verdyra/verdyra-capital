import PortalLogin from "@/components/portal/PortalLogin";
import Link from "next/link";
import { Shield, Upload, Users, ArrowRight, Activity, Home } from "lucide-react";

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7]">

      <div className="flex h-[100dvh] w-full px-4 lg:px-6 items-center justify-center">

        <div className="grid w-full max-w-[calc(100vw-32px)] lg:max-w-[calc(100vw-48px)] h-full overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-2">

          {/* LEFT - Premium Brand Panel */}

          <div className="flex flex-col h-full bg-[#0F5A3A] p-5 text-white lg:p-8">

            {/* Home link */}
            <div className="mb-2">
              <Link
                href="https://www.verdyracapital.in/"
                target="_self"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <Home size={18} />
                Home
              </Link>
            </div>

            {/* Verdyra Capital Logo */}
            <div className="mb-2">
              <Link
                href="https://www.verdyracapital.in/"
                target="_self"
                className="block max-w-[420px]"
                aria-label="Verdyra Capital"
              >
                <img
                  src="/images/logo/logo-horizontal.png"
                  alt="Verdyra Capital"
                  width={420}
                  height={90}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Link>
            </div>

            <h1 className="mt-1 text-4xl font-bold leading-tight lg:text-5xl">
              Your Funding Journey
              <br />
              Starts Here!
            </h1>

            <p className="mt-1 text-base text-white/80 max-w-md leading-relaxed">
              Upload documents, track your application, and stay connected with Verdyra — all in one secure place.
            </p>

            {/* Three compact benefit items - flatter, more elegant */}
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <BenefitItem
                icon={<Activity size={20} />}
                label="TRACK"
                description="Know where your application stands."
              />
              <BenefitItem
                icon={<Upload size={20} />}
                label="UPLOAD"
                description="Submit your documents securely."
              />
              <BenefitItem
                icon={<Users size={20} />}
                label="CONNECT"
                description="Stay connected with your Relationship Manager."
              />
            </div>

            {/* Security reassurance - subtle horizontal trust strip */}
            <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Shield size={18} className="flex-shrink-0 text-[#D4AF37]" />
              <p className="text-sm text-white/70">
                Your information and documents are securely stored and accessible only to you and the Verdyra team.
              </p>
            </div>

            {/* Your Funding Journey section - full-width visual timeline */}
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                Your Funding Journey
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <JourneyStep number="01" label="Upload Documents" />
                <ArrowRight size={18} className="text-white/30 flex-shrink-0" />
                <JourneyStep number="02" label="Verdyra Review" />
                <ArrowRight size={18} className="text-white/30 flex-shrink-0" />
                <JourneyStep number="03" label="Funding" />
              </div>
            </div>

            {/* Help section - subtle panel */}
            <div className="mt-3 p-3 rounded-xl bg-white/5">
              <p className="font-semibold text-white">
                Need help with your application?
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                Your Relationship Manager is here to help.
              </p>
            </div>

            {/* Footer - pushed to bottom */}
            <footer className="mt-auto pt-2 border-t border-white/10">
              <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr_1fr] text-center sm:text-left">
                <div>
                  <p className="text-sm font-medium text-white/70 whitespace-nowrap">© 2026 Verdyra Fintech Private Limited.</p>
                  <p className="text-sm font-medium text-white/70">All Rights Reserved.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-white/50">Email</p>
                  <a href="mailto:connect@verdyracapital.in" className="text-sm text-white/80 hover:text-white transition-colors">connect@verdyracapital.in</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-white/50">Website</p>
                  <a href="https://www.verdyracapital.in/" target="_self" className="text-sm text-white/80 hover:text-white transition-colors">www.verdyracapital.in</a>
                </div>
              </div>
            </footer>

          </div>

          {/* RIGHT - Secure Customer Portal Login */}

          <div className="flex items-center justify-center p-8 lg:p-12">

            <PortalLogin />

          </div>

        </div>

      </div>

    </main>
  );
}

function BenefitItem({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F5A3A]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-0.5 text-xs text-white/60">{description}</p>
    </div>
  );
}

function JourneyStep({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F5A3A] font-bold text-sm">
        {number}
      </div>
      <p className="mt-1.5 text-sm font-medium text-white">{label}</p>
    </div>
  );
}
