"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const res = await fetch("/api/portal/auth/session");

        if (res.status === 200) {
          if (mounted) setChecking(false);
          return;
        }

        // not authenticated
        try {
          sessionStorage.removeItem("customer");
        } catch (e) {}

        if (mounted) {
          router.replace("/portal");
        }
      } catch (err) {
        console.error(err);
        if (mounted) router.replace("/portal");
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-semibold text-slate-600">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}