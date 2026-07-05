"use client";

import { useEffect, useState } from "react";

import { getAllCustomers } from "@/lib/admin/customerService";

import CustomerDocumentList from "./CustomerDocumentList";

type Customer = {
  username: string;
  full_name: string;
  email: string;
  application_status: string | null;
};

export default function ReviewPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-12">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

      <div className="rounded-3xl border bg-white">

        <div className="border-b p-6">

          <h2 className="text-xl font-bold">
            Customers
          </h2>

        </div>

        <div className="divide-y">

          {customers.map((customer) => (

            <button
              key={customer.username}
              onClick={() =>
                setSelectedCustomer(customer)
              }
              className="w-full px-6 py-5 text-left hover:bg-slate-50"
            >

              <h3 className="font-semibold">
                {customer.full_name}
              </h3>

              <p className="text-sm text-slate-500">
                {customer.email}
              </p>

            </button>

          ))}

        </div>

      </div>

      <CustomerDocumentList
        customer={selectedCustomer}
      />

    </div>
  );
}