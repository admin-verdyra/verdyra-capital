import PortalLogin from "@/components/portal/PortalLogin";
import Link from "next/link";

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7]">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

        <div className="grid w-full overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-2">

          {/* LEFT */}

          <div className="flex flex-col justify-center bg-[#0F5A3A] p-12 text-white">

            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Verdyra Capital
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Customer
              <br />
              Portal
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Securely manage your loan application,
              upload documents and track your funding
              journey.
            </p>

            <div className="mt-12 space-y-4">

              <Feature text="Track application status" />

              <Feature text="Upload documents securely" />

              <Feature text="Receive instant updates" />

              <Feature text="Talk to your Relationship Manager" />

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center justify-center p-12">

            <PortalLogin />

          </div>

        </div>

      </div>

    </main>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F5A3A] font-bold">
        ✓
      </div>

      <span className="text-white/90">
        {text}
      </span>

    </div>
  );
}