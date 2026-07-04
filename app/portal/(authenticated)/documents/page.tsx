"use client";

import { useEffect, useState } from "react";
import DocumentsView from "@/components/portal/DocumentsView";

type Customer = {
  username: string;
  password: string;
  full_name: string;
  email: string;
};

export default function DocumentsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("customer");

    if (saved) {
      setCustomer(JSON.parse(saved));
    }
  }, []);

  if (!customer) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <DocumentsView
      customer={customer}
    />
  );
}