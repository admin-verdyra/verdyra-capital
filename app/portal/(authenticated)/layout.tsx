"use client";

import type { ReactNode } from "react";

import AuthGuard from "@/components/portal/AuthGuard";
import { PortalProvider } from "@/components/portal/PortalProvider";
import PortalShell from "@/components/layout/PortalShell";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalProvider>
      <AuthGuard>
        <PortalShell customerName="Himanshu Chauhan">
          {children}
        </PortalShell>
      </AuthGuard>
    </PortalProvider>
  );
}