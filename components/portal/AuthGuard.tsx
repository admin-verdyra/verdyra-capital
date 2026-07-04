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
    const customer = sessionStorage.getItem("customer");

    if (!customer) {
      router.replace("/portal");
      return;
    }

    setChecking(false);
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