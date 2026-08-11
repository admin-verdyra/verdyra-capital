"use client";

import { useEffect, useMemo, useState } from "react";

import { getAllCustomers } from "@/lib/admin/customerService";

import CustomerDocumentList from "./CustomerDocumentList";

type Customer = {
  username: string;
  full_name: string;
  email: string;
  application_status: string | null;
  created_by_admin_id: string | null;
};

type Admin = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  account_status?: string;
};

const ALL_ADMINS = "__ALL_ADMINS__";

export default function ReviewPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedAdminId, setSelectedAdminId] =
    useState<string>(ALL_ADMINS);
  const [adminLoading, setAdminLoading] = useState(false);

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

  // Super Admin only: load Admin accounts for customer filtering.
  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("admin");

    if (!storedAdmin) {
      return;
    }

    try {
      const admin = JSON.parse(storedAdmin);
      const superAdmin = admin?.role === "Super Admin";

      setIsSuperAdmin(superAdmin);

      if (!superAdmin) {
        return;
      }

      async function loadAdmins() {
        try {
          setAdminLoading(true);

          const response = await fetch("/api/admin/admins", {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          const result = await response.json();

          if (!response.ok || !result?.success) {
            throw new Error(
              result?.message || "Unable to load Admin accounts."
            );
          }

          setAdmins(result.admins ?? []);
        } catch (error) {
          console.error(
            "Failed to load Admin accounts:",
            error
          );
          setAdmins([]);
        } finally {
          setAdminLoading(false);
        }
      }

      loadAdmins();
    } catch (error) {
      console.error(
        "Failed to read Admin session:",
        error
      );
      setIsSuperAdmin(false);
    }
  }, []);

  const filteredCustomers = useMemo(() => {
    if (
      !isSuperAdmin ||
      selectedAdminId === ALL_ADMINS
    ) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.created_by_admin_id === selectedAdminId
    );
  }, [customers, isSuperAdmin, selectedAdminId]);

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

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              Customers
            </h2>

            {isSuperAdmin && (
              <select
                value={selectedAdminId}
                onChange={(e) =>
                  setSelectedAdminId(e.target.value)
                }
                disabled={adminLoading}
                aria-label="Filter customers by Admin"
                className="w-full max-w-[190px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value={ALL_ADMINS}>
                  All Admins
                </option>

                {admins.map((admin) => (
                  <option
                    key={admin.id}
                    value={admin.id}
                  >
                    {admin.full_name} — {admin.role}
                  </option>
                ))}
              </select>
            )}
          </div>

        </div>

        <div className="divide-y">

          {filteredCustomers.map((customer) => (

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