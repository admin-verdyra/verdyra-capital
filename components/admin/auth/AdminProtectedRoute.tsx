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
    async function verifyAdminSession() {
      const response = await fetch(
        "/api/admin/auth/session",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        sessionStorage.removeItem("admin");
        router.replace("/admin");
        return;
      }

      const result = await response.json();

      if (!result.success || !result.admin) {
        sessionStorage.removeItem("admin");
        router.replace("/admin");
        return;
      }

      sessionStorage.setItem(
        "admin",
        JSON.stringify(result.admin)
      );

      setLoading(false);
    }

    verifyAdminSession();
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
