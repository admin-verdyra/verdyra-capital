"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";

type TransferMerchant = {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  account_status: string;
  created_at: string;
};

type Admin = {
  id: string;
  username: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  auth_user_id: string | null;
  created_at: string | null;
  account_status: "active" | "disabled";
};

type FormState = {
  username: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
};

const initialForm: FormState = {
  username: "",
  full_name: "",
  email: "",
  phone: "",
  password: "",
};

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [transferAdmin, setTransferAdmin] = useState<Admin | null>(null);
  const [transferTargetId, setTransferTargetId] = useState("");
  const [transferMerchantsList, setTransferMerchantsList] = useState<
    TransferMerchant[]
  >([]);
  const [selectedMerchantIds, setSelectedMerchantIds] = useState<string[]>(
    []
  );
  const [loadingTransferMerchants, setLoadingTransferMerchants] =
    useState(false);
  const [transferring, setTransferring] = useState(false);

  async function loadAdmins() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/admins", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load Admin accounts."
        );
      }

      setAdmins(result.admins ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Admin accounts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function updateAdminStatus(
    adminId: string,
    accountStatus: "active" | "disabled"
  ) {
    setActionLoading(adminId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/admins",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            admin_id: adminId,
            account_status: accountStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update Admin status."
        );
      }

      setSuccess(result.message);
      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update Admin status."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function openTransferModal(admin: Admin) {
    setError("");
    setSuccess("");
    setTransferAdmin(admin);
    setTransferTargetId("");
    setSelectedMerchantIds([]);
    setTransferMerchantsList([]);
    setLoadingTransferMerchants(true);

    try {
      const response = await fetch(
        `/api/admin/admins?merchants_for_admin_id=${encodeURIComponent(
          admin.id
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load Admin merchants."
        );
      }

      setTransferMerchantsList(
        Array.isArray(result.merchants)
          ? result.merchants
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Admin merchants."
      );
    } finally {
      setLoadingTransferMerchants(false);
    }
  }

  function toggleMerchantSelection(
    merchantId: string
  ) {
    setSelectedMerchantIds((current) =>
      current.includes(merchantId)
        ? current.filter((id) => id !== merchantId)
        : [...current, merchantId]
    );
  }

  function toggleSelectAllMerchants() {
    if (
      selectedMerchantIds.length ===
      transferMerchantsList.length
    ) {
      setSelectedMerchantIds([]);
      return;
    }

    setSelectedMerchantIds(
      transferMerchantsList.map(
        (merchant) => merchant.id
      )
    );
  }

  async function transferMerchants() {
    if (!transferAdmin) return;

    if (selectedMerchantIds.length === 0) {
      setError(
        "Select at least one merchant to transfer."
      );
      return;
    }

    if (!transferTargetId) {
      setError(
        "Please select a target Admin."
      );
      return;
    }

    const targetAdmin = admins.find(
      (admin) => admin.id === transferTargetId
    );

    if (!targetAdmin) {
      setError("Please select a valid target Admin.");
      return;
    }

    const selectedMerchants =
      transferMerchantsList.filter((merchant) =>
        selectedMerchantIds.includes(merchant.id)
      );

    const merchantNames = selectedMerchants.map(
      (merchant) =>
        merchant.company ||
        merchant.full_name ||
        merchant.username
    );

    const confirmed = window.confirm(
      `Transfer ${selectedMerchantIds.length} ${
        selectedMerchantIds.length === 1
          ? "merchant"
          : "merchants"
      } from "${transferAdmin.full_name}" to "${targetAdmin.full_name}"?\n\nSelected merchants:\n• ${merchantNames.join(
        "\n• "
      )}`
    );

    if (!confirmed) return;

    setTransferring(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/admins",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            action: "transfer_merchants",
            admin_id: transferAdmin.id,
            target_admin_id: transferTargetId,
            customer_ids: selectedMerchantIds,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to transfer merchants."
        );
      }

      setSuccess(
        result.email_sent
          ? `${result.message} Assignment email sent successfully.`
          : result.email_warning
            ? `${result.message} ${result.email_warning}`
            : result.message
      );

      setTransferAdmin(null);
      setTransferTargetId("");
      setSelectedMerchantIds([]);
      setTransferMerchantsList([]);

      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to transfer merchants."
      );
    } finally {
      setTransferring(false);
    }
  }

  async function deleteAdmin(admin: Admin) {
    const confirmed = window.confirm(
      `Delete Admin "${admin.full_name}" (@${admin.username}) permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(admin.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/admins",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            admin_id: admin.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete Admin."
        );
      }

      setSuccess(result.message);
      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete Admin."
      );
    } finally {
      setActionLoading(null);
    }
  }

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function closeModal() {
    if (creating) return;

    setIsModalOpen(false);
    setForm(initialForm);
    setError("");
  }

  async function handleCreateAdmin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create Admin."
        );
      }

      setSuccess("Admin created successfully.");
      setForm(initialForm);
      setIsModalOpen(false);

      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create Admin."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F5A3A]/10">
              <ShieldCheck
                size={22}
                className="text-[#0F5A3A]"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Admin Management
              </h2>

              <p className="text-sm text-slate-500">
                Create and manage Verdyra Admin accounts.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5A3A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0A402A]"
        >
          <Plus size={18} />
          Create Admin
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* Error */}
      {error && !isModalOpen && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Admin Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={28}
                className="mx-auto animate-spin text-[#0F5A3A]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading Admin accounts...
              </p>
            </div>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <UserPlus
                size={24}
                className="text-slate-500"
              />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No Admin accounts found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create the first Admin account to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Admin
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {admin.full_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          @{admin.username}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {admin.email || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {admin.phone || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          admin.role === "Super Admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {admin.created_at
                        ? new Date(
                            admin.created_at
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          admin.account_status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.account_status === "active"
                          ? "Active"
                          : "Disabled"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={transferring}
                          onClick={() => openTransferModal(admin)}
                          className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-3 py-2 text-xs font-semibold text-[#8A6D1D] transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Transfer Merchants
                        </button>

                        {admin.role !== "Super Admin" && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoading === admin.id}
                              onClick={() =>
                                updateAdminStatus(
                                  admin.id,
                                  admin.account_status === "active"
                                    ? "disabled"
                                    : "active"
                                )
                              }
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                admin.account_status === "active"
                                  ? "border border-red-200 text-red-600 hover:bg-red-50"
                                  : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {actionLoading === admin.id
                                ? "Please wait..."
                                : admin.account_status === "active"
                                  ? "Disable"
                                  : "Enable"}
                            </button>

                            <button
                              type="button"
                              disabled={actionLoading === admin.id}
                              onClick={() => deleteAdmin(admin)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Merchants Modal */}
      {transferAdmin && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Transfer Merchants
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select the merchants to transfer from{" "}
                  <strong>{transferAdmin.full_name}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (transferring) return;

                  setTransferAdmin(null);
                  setTransferTargetId("");
                  setSelectedMerchantIds([]);
                  setTransferMerchantsList([]);
                }}
                disabled={transferring}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close transfer modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {loadingTransferMerchants ? (
                <div className="flex items-center justify-center py-12 text-sm text-slate-500">
                  <Loader2
                    size={20}
                    className="mr-2 animate-spin"
                  />
                  Loading merchants...
                </div>
              ) : transferMerchantsList.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    No merchants currently assigned
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    This Admin can be deleted without transferring
                    any merchants.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {transferMerchantsList.length}{" "}
                        {transferMerchantsList.length === 1
                          ? "merchant"
                          : "merchants"}{" "}
                        available
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedMerchantIds.length} selected
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={toggleSelectAllMerchants}
                      disabled={transferring}
                      className="text-sm font-semibold text-[#0F5A3A] hover:underline disabled:opacity-50"
                    >
                      {selectedMerchantIds.length ===
                      transferMerchantsList.length
                        ? "Clear All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                    {transferMerchantsList.map(
                      (merchant) => {
                        const selected =
                          selectedMerchantIds.includes(
                            merchant.id
                          );

                        return (
                          <label
                            key={merchant.id}
                            className={`flex cursor-pointer items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0 transition ${
                              selected
                                ? "bg-[#0F5A3A]/5"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                toggleMerchantSelection(
                                  merchant.id
                                )
                              }
                              disabled={transferring}
                              className="h-4 w-4 rounded border-slate-300 text-[#0F5A3A] focus:ring-[#0F5A3A]"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {merchant.company ||
                                  merchant.full_name ||
                                  merchant.username}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {merchant.username}
                                {merchant.email
                                  ? ` • ${merchant.email}`
                                  : ""}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {merchant.application_status ||
                                  "Application status unavailable"}
                              </p>
                            </div>
                          </label>
                        );
                      }
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Transfer Selected Merchants To
                    </label>

                    <select
                      value={transferTargetId}
                      onChange={(event) =>
                        setTransferTargetId(
                          event.target.value
                        )
                      }
                      disabled={transferring}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                      <option value="">
                        Select Admin
                      </option>

                      {admins
                        .filter(
                          (admin) =>
                            admin.id !==
                              transferAdmin.id &&
                            admin.account_status ===
                              "active"
                        )
                        .map((admin) => (
                          <option
                            key={admin.id}
                            value={admin.id}
                          >
                            {admin.full_name} —{" "}
                            {admin.role}
                          </option>
                        ))}
                    </select>

                    <p className="mt-2 text-xs text-slate-400">
                      Only active Admin accounts can receive
                      merchants.
                    </p>
                  </div>
                </>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setTransferAdmin(null);
                    setTransferTargetId("");
                    setSelectedMerchantIds([]);
                    setTransferMerchantsList([]);
                  }}
                  disabled={transferring}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={transferMerchants}
                  disabled={
                    transferring ||
                    loadingTransferMerchants ||
                    transferMerchantsList.length === 0 ||
                    selectedMerchantIds.length === 0 ||
                    !transferTargetId
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A402A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {transferring ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Transferring...
                    </>
                  ) : (
                    `Transfer ${
                      selectedMerchantIds.length || ""
                    } ${
                      selectedMerchantIds.length === 1
                        ? "Merchant"
                        : "Merchants"
                    }`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Create Admin
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new Verdyra Admin account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateAdmin}
              className="space-y-6 p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Admin Username
                  </label>

                  <input
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="[A-Za-z0-9_-]+"
                    value={form.username}
                    onChange={(event) =>
                      updateField(
                        "username",
                        event.target.value
                      )
                    }
                    placeholder="e.g. rahul-admin"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Letters, numbers, hyphens and underscores.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Admin Name
                  </label>

                  <input
                    required
                    value={form.full_name}
                    onChange={(event) =>
                      updateField(
                        "full_name",
                        event.target.value
                      )
                    }
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="admin@verdyracapital.in"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Temporary Password
                  </label>

                  <input
                    required
                    type="password"
                    minLength={8}
                    maxLength={128}
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/10"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    The password is stored securely by Supabase
                    Auth and is never stored in the Admin table.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <strong>Security:</strong> This account will be
                created with the <strong>Admin</strong> role.
                Only the Super Admin can create Admin accounts.
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A402A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Create Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
