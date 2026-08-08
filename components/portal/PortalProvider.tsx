"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Customer,
  UploadedDocument,
} from "./types";

type PortalContextType = {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;

  documentsById: Record<string, UploadedDocument>;
  setDocumentsById: React.Dispatch<
    React.SetStateAction<Record<string, UploadedDocument>>
  >;
};

const PortalContext = createContext<PortalContextType | null>(null);

export function PortalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [documentsById, setDocumentsById] = useState<
    Record<string, UploadedDocument>
  >({});

  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      try {
        const res = await fetch("/api/portal/auth/session");

        if (res.status === 401) {
          try {
            sessionStorage.removeItem("customer");
          } catch (e) {}

          if (mounted) {
            setCustomer(null);
            // redirect to portal login
            window.location.href = "/portal";
          }

          return;
        }

        const data = await res.json();

        if (data?.success && data.customer) {
          if (mounted) {
            setCustomer(data.customer);
            try {
              sessionStorage.setItem(
                "customer",
                JSON.stringify(data.customer)
              );
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PortalContext.Provider
      value={{
        customer,
        setCustomer,
        documentsById,
        setDocumentsById,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);

  if (!context) {
    throw new Error(
      "usePortal must be used inside PortalProvider"
    );
  }

  return context;
}