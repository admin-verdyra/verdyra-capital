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
    const saved = sessionStorage.getItem("customer");

    if (saved) {
      setCustomer(JSON.parse(saved));
    }
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