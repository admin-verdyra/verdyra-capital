"use client";

import type { ReactNode } from "react";

import AuthGuard from "@/components/portal/AuthGuard";
import { PortalProvider, usePortal } from "@/components/portal/PortalProvider";
import PortalShell from "@/components/layout/PortalShell";

function PortalShellWrapper({ children }: { children: ReactNode }) {
  const { customer } = usePortal();
  const customerName = customer?.full_name ?? "Customer";

  return (
    <PortalShell customerName={customerName}>
      {children}
    </PortalShell>
  );
}

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalProvider>
      <AuthGuard>
        <PortalShellWrapper>
          {children}
        </PortalShellWrapper>
      </AuthGuard>
    </PortalProvider>
  );
}
