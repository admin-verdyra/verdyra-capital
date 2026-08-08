"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Plus } from "lucide-react";

import type { Customer } from "@/components/portal/types";
import { getCustomers } from "@/lib/admin/customers";
import CustomerDetailsDrawer from "./CustomerDetailsDrawer";
import CreateMerchantModal from "./CreateMerchantModal";

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  async function loadCustomers() {
    const data = await getCustomers();

    setCustomers(data);
    setFilteredCustomers(data);

    setLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredCustomers(
      customers.filter((customer) => {
        return (
          customer.full_name
            .toLowerCase()
            .includes(value) ||
          customer.email
            .toLowerCase()
            .includes(value) ||
          customer.username
            .toLowerCase()
            .includes(value)
        );
      })
    );
  }, [customers, search]);

  function openCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelectedCustomer(null);
  }

  if (loading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-10 shadow-sm">
        Loading customers...
      </div>
    );
  }

  return (
    <>
      <section className="rounded-[30px] border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              Customers
            </h2>

            <p className="mt-1 text-slate-500">
              {filteredCustomers.length} customer(s)
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                placeholder="Search customer..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="outline-none"
              />

            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#0F5A3A] px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              <Plus size={20} />
              Create Merchant
            </button>

          </div>

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Product
              </th>

              <th className="px-6 py-4 text-left">
                Loan Amount
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                RM
              </th>

              <th className="px-6 py-4 text-center">
                View
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCustomers.map((customer) => (

              <tr
                key={customer.username}
                className="border-t transition hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <div>

                    <h3 className="font-semibold">
                      {customer.full_name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {customer.email}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5">
                  {customer.product}
                </td>

                <td className="px-6 py-5">
                  ₹
                  {Number(
                    customer.loan_amount ?? 0
                  ).toLocaleString("en-IN")}
                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">

                    {customer.application_status}

                  </span>

                </td>

                <td className="px-6 py-5">
                  {customer.relationship_manager}
                </td>

                <td className="px-6 py-5 text-center">

                  <button
                    onClick={() =>
                      openCustomer(customer)
                    }
                    className="rounded-xl border p-3 transition hover:bg-slate-100"
                  >

                    <Eye size={18} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

      <CustomerDetailsDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onClose={closeDrawer}
      />

      <CreateMerchantModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => loadCustomers()}
      />
    </>
  );
}