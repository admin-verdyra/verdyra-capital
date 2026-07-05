import AdminLogin from "@/components/admin/login/AdminLogin";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7]">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

        <div className="grid w-full overflow-hidden rounded-[36px] bg-white shadow-2xl lg:grid-cols-2">

          <div className="flex flex-col justify-center bg-slate-900 p-12 text-white">

            <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
              Verdyra Capital
            </p>

            <h1 className="mt-6 text-5xl font-bold">
              Admin Portal
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Secure administration dashboard for managing
              customers, documents, lending pipeline and
              relationship managers.
            </p>

          </div>

          <div className="flex items-center justify-center p-12">

            <AdminLogin />

          </div>

        </div>

      </div>

    </main>
  );
}