"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import type { Customer } from "@/components/portal/types";
import { getCustomers, updateCustomerStatus } from "@/lib/admin/customers";
import { isValidStatus, APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/admin/applicationStatus";
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

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

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

  async function handleStatusChange(customer: Customer, newStatus: string) {
    if (!newStatus || newStatus === customer.application_status) return;

    setUpdatingStatus(customer.username);
    setStatusError(null);
    setStatusSuccess(null);

    try {
      // Use the dedicated status update function that only updates application_status
      await updateCustomerStatus(customer.username, newStatus);
      setStatusSuccess(customer.username);
      // Reload customers to reflect the change
      await loadCustomers();
    } catch (err) {
      const error = err as Error;
      setStatusError(error.message || "Failed to update application status");
    } finally {
      setUpdatingStatus(null);
    }
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      "Application Received": "bg-blue-100 text-blue-800",
      "Login Created": "bg-indigo-100 text-indigo-800",
      "Documents Pending": "bg-amber-100 text-amber-800",
      "Document Received": "bg-lime-100 text-lime-800",
      "Under Credit Evaluation": "bg-orange-100 text-orange-800",
      "Approved": "bg-emerald-100 text-emerald-800",
      "Rejected": "bg-red-100 text-red-800",
      "Sanctioned": "bg-purple-100 text-purple-800",
      "Disbursed": "bg-teal-100 text-teal-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
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
                Application Status
              </th>

              <th className="px-6 py-4 text-left">
                Account Status
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

            {filteredCustomers.map((customer) => {
              const isUpdating = updatingStatus === customer.username;
              const showError = statusError && updatingStatus === customer.username;
              const showSuccess = statusSuccess === customer.username;

              return (
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
                    <div className="relative">
                      <select
                        value={customer.application_status ?? ""}
                        onChange={(e) => handleStatusChange(customer, e.target.value)}
                        disabled={isUpdating}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium focus:border-[#0F5A3A] focus:outline-none focus:ring-1 focus:ring-[#0F5A3A] ${getStatusColor(customer.application_status ?? "")}`}
                      >
                        <option value="">{customer.application_status ?? "Not Set"} (Current)</option>
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      {isUpdating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                          <Loader2 size={18} className="animate-spin text-[#0F5A3A]" />
                        </div>
                      )}
                    </div>

                    {showError && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={14} />
                        <span>{statusError}</span>
                      </div>
                    )}

                    {showSuccess && (
                      <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle size={14} />
                        <span>Status updated</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
                        (customer.account_status === 'active'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800")
                      }
                    >
                      {customer.account_status === 'active' ? 'Active' : 'Disabled'}
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
              );
            })}

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
