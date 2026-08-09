import AdminLogin from "@/components/admin/login/AdminLogin";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7]">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

        <div className="grid w-full overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-2">

          <div className="flex flex-col justify-between bg-[#0F5A3A] p-12 text-white relative overflow-hidden">

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-8 text-white/80 hover:text-white transition-colors"
                aria-label="Verdyra Capital Home"
              >
                <svg
                  className="h-10 w-10"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="32" height="32" rx="8" fill="#D4AF37" />
                  <path
                    d="M16 8L22 16L16 24"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-lg tracking-tight">Verdyra Capital</span>
              </Link>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Manage Your <span className="text-[#D4AF37]">Funding Operations</span>
              </h1>

              <p className="mt-6 text-lg text-white/80 max-w-md">
                Secure access to manage customers, applications, documents and funding operations.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/90 text-sm font-medium border border-white/20">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Customers
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/90 text-sm font-medium border border-white/20">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Applications
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/90 text-sm font-medium border border-white/20">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Documents
                </span>
              </div>
            </div>

            <p className="text-white/40 text-sm mt-8">
              © 2026 Verdyra Fintech Private Limited. All Rights Reserved.
            </p>

          </div>

          <div className="flex items-center justify-center p-8 lg:p-12">

            <AdminLogin />

          </div>

        </div>

      </div>

    </main>
  );
}
