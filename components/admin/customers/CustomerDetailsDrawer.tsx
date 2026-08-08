"use client";

import { useState } from "react";
import {
  X,
  Mail,
  IndianRupee,
  BriefcaseBusiness,
  CircleCheckBig,
  UserRound,
  CalendarDays,
  Phone,
  Building2,
  Cake,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import type { Customer } from "@/components/portal/types";
import { deleteCustomer, updateCustomer } from "@/lib/admin/customers";

type Props = {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
};

export default function CustomerDetailsDrawer({
  customer,
  open,
  onClose,
}: Props) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleAccountStatusChange(newStatus: 'active' | 'disabled') {
    if (!customer) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: customer.username, account_status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to update account status");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update account status");
    } finally {
      setUpdating(false);
    }
  }

  function handleInputChange(field: string, value: string | number | null) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveError(null);
    setSaveSuccess(false);
  }

  function handleCancel() {
    if (customer) {
      setFormData({
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        date_of_birth: customer.date_of_birth,
        loan_amount: customer.loan_amount,
        product: customer.product,
        application_status: customer.application_status,
        relationship_manager: customer.relationship_manager,
        relationship_manager_phone: customer.relationship_manager_phone,
        expected_approval_date: customer.expected_approval_date,
        progress: customer.progress,
      });
    }
    setEditMode(false);
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    if (!customer) return;
    setUpdating(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const result = await updateCustomer(customer.username, formData);
      // Update the customer data in parent via reload or callback
      // For now, reload to reflect changes
      setSaveSuccess(true);
      setEditMode(false);
      // Small delay to show success state
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      const error = err as Error;
      setSaveError(error.message || "Failed to update customer");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteCustomer() {
    if (!customer) return;

    if (deleteConfirmationInput !== customer.username) {
      return;
    }

    setDeleting(true);

    try {
      await deleteCustomer(customer.username);
      window.location.reload();
    } catch (err) {
      const error = err as Error;
      console.error(error);
      alert(error.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  }

  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-8">

          <div>

            <h2 className="text-3xl font-bold">
              {customer.full_name}
            </h2>

            <p className="mt-2 text-slate-500">
              Customer Profile
            </p>

          </div>

          <div className="flex items-center gap-3">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="rounded-xl border px-4 py-2 font-medium hover:bg-slate-50"
              >
                Edit Customer
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border p-3 hover:bg-slate-50"
              disabled={updating}
            >
              <X size={22} />
            </button>

          </div>

        </div>

        <div className="space-y-8 p-8">

          {saveSuccess && (
            <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 font-medium">Customer updated successfully</p>
            </div>
          )}

          {saveError && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800 font-medium">{saveError}</p>
            </div>
          )}

          {/* PROFILE SECTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">PROFILE</h3>

            {editMode ? (
              <>
                <EditField
                  label="Full Name"
                  icon={<UserRound size={20} />}
                  value={formData.full_name || ""}
                  onChange={(v) => handleInputChange("full_name", v)}
                  required
                  maxLength={255}
                />
                <EditField
                  label="Email"
                  icon={<Mail size={20} />}
                  type="email"
                  value={formData.email || ""}
                  onChange={(v) => handleInputChange("email", v)}
                  required
                />
                <EditField
                  label="Phone"
                  icon={<Phone size={20} />}
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(v) => handleInputChange("phone", v || null)}
                  maxLength={20}
                />
                <EditField
                  label="Company"
                  icon={<Building2 size={20} />}
                  value={formData.company || ""}
                  onChange={(v) => handleInputChange("company", v || null)}
                  maxLength={255}
                />
                <EditField
                  label="Date of Birth"
                  icon={<Cake size={20} />}
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(v) => handleInputChange("date_of_birth", v || null)}
                />
              </>
            ) : (
              <>
                <InfoRow
                  icon={<UserRound size={20} />}
                  label="Full Name"
                  value={customer.full_name}
                />
                <InfoRow
                  icon={<Mail size={20} />}
                  label="Email"
                  value={customer.email}
                />
                <InfoRow
                  icon={<Phone size={20} />}
                  label="Phone"
                  value={customer.phone ?? "-"}
                />
                <InfoRow
                  icon={<Building2 size={20} />}
                  label="Company"
                  value={customer.company ?? "-"}
                />
                <InfoRow
                  icon={<Cake size={20} />}
                  label="Date of Birth"
                  value={customer.date_of_birth ?? "-"}
                />
              </>
            )}
          </div>

          {/* APPLICATION SECTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">APPLICATION</h3>

            {editMode ? (
              <>
                <EditField
                  label="Loan Amount"
                  icon={<IndianRupee size={20} />}
                  type="number"
                  value={formData.loan_amount ?? ""}
                  onChange={(v) => handleInputChange("loan_amount", v ? Number(v) : null)}
                  min={0}
                  step={1000}
                />
                <EditSelect
                  label="Product"
                  icon={<BriefcaseBusiness size={20} />}
                  value={formData.product || ""}
                  onChange={(v) => handleInputChange("product", v || null)}
                  options={["Business Loan", "Personal Loan"]}
                />
                <EditSelect
                  label="Application Status"
                  icon={<CircleCheckBig size={20} />}
                  value={formData.application_status || ""}
                  onChange={(v) => handleInputChange("application_status", v || null)}
                  options={["Submitted", "Under Review", "Approved", "Rejected", "Disbursed"]}
                />
                <EditField
                  label="Expected Approval Date"
                  icon={<CalendarDays size={20} />}
                  type="date"
                  value={formData.expected_approval_date || ""}
                  onChange={(v) => handleInputChange("expected_approval_date", v || null)}
                />
                <EditField
                  label="Progress"
                  icon={<CircleCheckBig size={20} />}
                  type="number"
                  value={formData.progress ?? ""}
                  onChange={(v) => handleInputChange("progress", v ? Number(v) : null)}
                  min={0}
                  max={100}
                />
              </>
            ) : (
              <>
                <InfoRow
                  icon={<IndianRupee size={20} />}
                  label="Loan Amount"
                  value={
                    customer.loan_amount
                      ? `₹${Number(customer.loan_amount).toLocaleString("en-IN")}`
                      : "-"
                  }
                />
                <InfoRow
                  icon={<BriefcaseBusiness size={20} />}
                  label="Product"
                  value={customer.product ?? "-"}
                />
                <InfoRow
                  icon={<CircleCheckBig size={20} />}
                  label="Application Status"
                  value={customer.application_status ?? "-"}
                />
                <InfoRow
                  icon={<CalendarDays size={20} />}
                  label="Expected Approval"
                  value={customer.expected_approval_date ?? "-"}
                />
                <InfoRow
                  icon={<CircleCheckBig size={20} />}
                  label="Progress"
                  value={customer.progress !== null ? `${customer.progress}%` : "-"}
                />
              </>
            )}
          </div>

          {/* RELATIONSHIP MANAGER SECTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">RELATIONSHIP MANAGER</h3>

            {editMode ? (
              <>
                <EditField
                  label="Relationship Manager"
                  icon={<UserRound size={20} />}
                  value={formData.relationship_manager || ""}
                  onChange={(v) => handleInputChange("relationship_manager", v || null)}
                  maxLength={255}
                />
                <EditField
                  label="RM Phone"
                  icon={<Phone size={20} />}
                  type="tel"
                  value={formData.relationship_manager_phone || ""}
                  onChange={(v) => handleInputChange("relationship_manager_phone", v || null)}
                  maxLength={20}
                />
              </>
            ) : (
              <>
                <InfoRow
                  icon={<UserRound size={20} />}
                  label="Relationship Manager"
                  value={customer.relationship_manager ?? "-"}
                />
                <InfoRow
                  icon={<Phone size={20} />}
                  label="RM Phone"
                  value={customer.relationship_manager_phone ?? "-"}
                />
              </>
            )}
          </div>

          {/* ACCOUNT STATUS - Always visible, not editable in general form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">ACCOUNT STATUS</h3>

            <div className="flex items-center gap-4 rounded-2xl border p-5">
              <div className="rounded-xl bg-slate-100 p-3">
                <UserRound size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Account Status</p>
                <h3 className="mt-1 font-semibold">
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
                </h3>
              </div>
            </div>

            <div className="grid gap-4 pt-4">

              <button
                className="rounded-2xl bg-[#0F5A3A] py-4 font-semibold text-white hover:bg-[#0B4B31]"
                disabled={updating || editMode}
              >
                Update Status
              </button>

              <button
                className="rounded-2xl border py-4 font-semibold hover:bg-slate-50"
                disabled={updating || editMode}
              >
                Assign Relationship Manager
              </button>

              <button
                className="rounded-2xl border py-4 font-semibold hover:bg-slate-50"
                disabled={updating || editMode}
              >
                Review Documents
              </button>

              {customer.account_status === 'active' ? (
                <button
                  className="rounded-2xl border border-red-300 text-red-700 py-4 font-semibold hover:bg-red-50"
                  onClick={() => handleAccountStatusChange('disabled')}
                  disabled={updating || deleting || editMode}
                >
                  {updating ? 'Disabling...' : 'Disable Account'}
                </button>
              ) : (
                <button
                  className="rounded-2xl border border-green-300 text-green-700 py-4 font-semibold hover:bg-green-50"
                  onClick={() => handleAccountStatusChange('active')}
                  disabled={updating || deleting || editMode}
                >
                  {updating ? 'Enabling...' : 'Enable Account'}
                </button>
              )}

              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-800">Delete Customer?</p>
                  <p className="text-sm text-slate-600">
                    This will permanently delete the customer, their login access, uploaded documents, and stored files. This action cannot be undone.
                  </p>
                  <label className="block text-sm font-medium text-slate-900">
                    Type the customer's exact username to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmationInput}
                    onChange={(event) => setDeleteConfirmationInput(event.target.value)}
                    className="w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    placeholder={customer.username}
                    disabled={deleting}
                  />
                  <button
                    className="w-full rounded-2xl bg-red-600 py-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleDeleteCustomer}
                    disabled={
                      updating ||
                      deleting ||
                      editMode ||
                      deleteConfirmationInput !== customer.username
                    }
                  >
                    {deleting ? 'Deleting...' : 'Delete Customer'}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* EDIT MODE ACTIONS */}
          {editMode && (
            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-2xl border py-4 font-semibold hover:bg-slate-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-2xl bg-[#0F5A3A] py-4 font-semibold text-white hover:bg-[#0B4B31]"
                disabled={updating}
              >
                {updating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          )}

        </div>

      </aside>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-5">

      <div className="rounded-xl bg-slate-100 p-3">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <h3 className="mt-1 font-semibold">
          {value}
        </h3>

      </div>

    </div>
  );
}

function EditField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  required = false,
  maxLength,
  min,
  max,
  step,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-5">

      <div className="rounded-xl bg-slate-100 p-3">
        {icon}
      </div>

      <div className="flex-1">
        <label className="flex items-center gap-2 text-sm text-slate-500">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-[#0F5A3A] focus:outline-none focus:ring-1 focus:ring-[#0F5A3A]"
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          required={required}
        />
      </div>

    </div>
  );
}

function EditSelect({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-5">

      <div className="rounded-xl bg-slate-100 p-3">
        {icon}
      </div>

      <div className="flex-1">
        <label className="text-sm text-slate-500">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-[#0F5A3A] focus:outline-none focus:ring-1 focus:ring-[#0F5A3A]"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

    </div>
  );
}