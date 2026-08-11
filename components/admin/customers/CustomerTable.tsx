"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Eye, Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import type { Customer } from "@/components/portal/types";
import { getCustomers, updateCustomerStatus } from "@/lib/admin/customers";
import { isValidStatus, APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/admin/applicationStatus";
import CustomerDetailsDrawer from "./CustomerDetailsDrawer";
import CreateMerchantModal from "./CreateMerchantModal";

interface CustomerTableProps {
  selectedStatus: string | null;
}

type Admin = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  account_status?: string;
};

const ALL_ADMINS = "__ALL_ADMINS__";

export default function CustomerTable({ selectedStatus }: CustomerTableProps) {
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedAdminId, setSelectedAdminId] =
    useState<string>(ALL_ADMINS);
  const [adminLoading, setAdminLoading] = useState(false);

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

  useEffect(() => {
    const tableScroll = tableScrollRef.current;
    const scrollbar = scrollbarRef.current;

    if (!tableScroll || !scrollbar) return;

    const syncCustomerTableScrollbar = () => {
      scrollbar.scrollLeft = tableScroll.scrollLeft;
    };

    const syncCustomerTable = () => {
      tableScroll.scrollLeft = scrollbar.scrollLeft;
    };

    tableScroll.addEventListener("scroll", syncCustomerTableScrollbar);
    scrollbar.addEventListener("scroll", syncCustomerTable);

    return () => {
      tableScroll.removeEventListener("scroll", syncCustomerTableScrollbar);
      scrollbar.removeEventListener("scroll", syncCustomerTable);
    };
  }, []);

  async function loadCustomers() {
    const data = await getCustomers();

    setCustomers(data);
    setFilteredCustomers(data);

    setLoading(false);
  }

  useEffect(() => {
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

  // Filter by application status from URL
  useEffect(() => {
    let filtered = customers;

    if (selectedStatus) {
      if (selectedStatus === "Not Set") {
        filtered = customers.filter((customer) => {
          const status = customer.application_status;
          return !status || !isValidStatus(status);
        });
      } else {
        filtered = customers.filter((customer) => customer.application_status === selectedStatus);
      }
    }

    // Super Admin only: filter customers by Admin owner.
    if (
      isSuperAdmin &&
      selectedAdminId !== ALL_ADMINS
    ) {
      filtered = filtered.filter(
        (customer) =>
          customer.created_by_admin_id === selectedAdminId
      );
    }

    // Then apply search filter
    const value = search.toLowerCase();
    filtered = filtered.filter((customer) => {
      return (
        customer.full_name.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value) ||
        customer.username.toLowerCase().includes(value)
      );
    });

    setFilteredCustomers(filtered);
  }, [
    customers,
    search,
    selectedStatus,
    isSuperAdmin,
    selectedAdminId,
  ]);

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
            <h2 className="text-2xl font-bold">Customers</h2>

            {selectedStatus && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Showing:</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {selectedStatus}
                </span>
              </div>
            )}

            <p className="mt-1 text-slate-500">
              {filteredCustomers.length} customer(s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none"
              />
            </div>

            {isSuperAdmin && (
              <select
                value={selectedAdminId}
                onChange={(e) =>
                  setSelectedAdminId(e.target.value)
                }
                disabled={adminLoading}
                aria-label="Filter customers by Admin"
                className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
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

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#0F5A3A] px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              <Plus size={20} />
              Create Merchant
            </button>
          </div>
        </div>

        <div
          ref={tableScrollRef}
          className="w-full overflow-x-auto overflow-y-hidden"
        >
            <table
              className="table-fixed"
              style={{ width: "1450px", minWidth: "1450px" }}
            >
            <thead className="bg-slate-50">
            <tr>
              <th style={{ width: "240px" }} className="px-6 py-4 text-left whitespace-nowrap">Customer</th>
              <th style={{ width: "190px" }} className="px-6 py-4 text-left whitespace-nowrap">Admin</th>
              <th style={{ width: "150px" }} className="px-6 py-4 text-left whitespace-nowrap">Product</th>
              <th style={{ width: "160px" }} className="px-6 py-4 text-left whitespace-nowrap">Loan Amount</th>
              <th style={{ width: "240px" }} className="px-6 py-4 text-left whitespace-nowrap">Application Status</th>
              <th style={{ width: "150px" }} className="px-6 py-4 text-left whitespace-nowrap">Account Status</th>
              <th style={{ width: "180px" }} className="px-6 py-4 text-left whitespace-nowrap">RM</th>
              <th
                style={{ width: "100px" }}
                className="px-4 py-4 text-center whitespace-nowrap bg-slate-50"
              >
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
                <tr key={customer.username} className="border-t transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-semibold">{customer.full_name}</h3>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {customer.admin_username ? (
                      <div>
                        <p className="font-medium text-slate-900">
                          {customer.admin_full_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          @{customer.admin_username}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">{customer.product}</td>

                  <td className="px-6 py-5">
                    ₹{Number(customer.loan_amount ?? 0).toLocaleString("en-IN")}
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
                        (customer.account_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800")
                      }
                    >
                      {customer.account_status === "active" ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="px-6 py-5">{customer.relationship_manager}</td>

                  <td className="min-w-[100px] bg-white px-4 py-5 text-center whitespace-nowrap">
                    <button
                      onClick={() => openCustomer(customer)}
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

          <div
            ref={scrollbarRef}
            className="mx-4 mb-4 mt-2 h-4 overflow-x-auto rounded-full bg-slate-100"
            aria-label="Horizontal table scrollbar"
          >
            <div style={{ width: "1450px", height: "1px" }} />
          </div>
        </div>
      </section>

      <CustomerDetailsDrawer customer={selectedCustomer} open={drawerOpen} onClose={closeDrawer} />

      <CreateMerchantModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={() => loadCustomers()} />
    </>
  );
}