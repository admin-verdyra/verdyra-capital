"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = sessionStorage.getItem("admin");

    if (!admin) {
      router.replace("/admin");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F8F7]">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0F5A3A] border-t-transparent" />

          <p className="mt-6 text-slate-600">
            Verifying session...
          </p>

        </div>

      </div>
    );
  }

  return <>{children}</>;
}