import PortalLogin from "@/components/portal/PortalLogin";
import Link from "next/link";
import { Home, Upload, Shield, Lock } from "lucide-react";

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7] pt-6 lg:pt-24 pb-6 lg:pb-10">
      <div className="flex w-full px-4 lg:px-6 items-start justify-center">
        <div className="grid w-full max-w-[1440px] overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-2">
          {/* LEFT - Premium Brand Panel */}
          <div className="flex flex-col bg-[#0F5A3A] p-6 lg:p-10 text-white">
            {/* Brand block: Home + Logo + Headline + Copy + Benefits */}
            <div className="flex-1 flex flex-col">
              {/* Home link - grouped with logo */}
              <div className="mb-4 lg:mb-6">
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
              <div className="mb-6 lg:mb-8">
                <Link
                  href="https://www.verdyracapital.in/"
                  target="_self"
                  className="block w-full max-w-[360px]"
                  aria-label="Verdyra Capital"
                >
                  <img
                    src="/images/logo/logo-horizontal.png"
                    alt="Verdyra Capital"
                    width={420}
                    height={90}
                    style={{
                      width: "100%",
                      maxWidth: "360px",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              {/* Main heading */}
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight mb-3">
                Your Funding Journey
                <br />
                <span className="text-[#D4AF37]">Starts Here</span>
              </h1>

              {/* Supporting text */}
              <p className="text-sm lg:text-base text-white/80 max-w-md leading-relaxed mb-5">
                Simple, transparent funding for your business — from application to disbursement.
              </p>

              {/* Three compact benefits */}
              <div className="grid gap-2.5 sm:grid-cols-3">
                <BenefitItem
                  icon={<Upload size={16} />}
                  label="Upload"
                  description="Submit documents securely."
                />
                <BenefitItem
                  icon={<Shield size={16} />}
                  label="Track"
                  description="Follow application progress."
                />
                <BenefitItem
                  icon={<Lock size={16} />}
                  label="Secure"
                  description="Your data stays protected."
                />
              </div>
            </div>

            {/* Copyright at bottom of green panel */}
            <div className="pt-4 text-left">
              <p className="text-xs text-white/40">
                © 2026 Verdyra Fintech Private Limited. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* RIGHT - Secure Customer Portal Login */}
          <div className="flex items-center justify-center p-6 lg:p-10">
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
    <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F5A3A]">
        {icon}
      </div>
      <p className="text-xs lg:text-sm font-semibold text-white">{label}</p>
      <p className="mt-0.5 text-[10px] lg:text-xs text-white/60">{description}</p>
    </div>
  );
}