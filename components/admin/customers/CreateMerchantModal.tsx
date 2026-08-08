"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type FormData = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  company: string;
  phone: string;
  loan_amount: string;
  product: string;
  application_status: string;
  relationship_manager: string;
  relationship_manager_phone: string;
  expected_approval_date: string;
  progress: string;
};

export default function CreateMerchantModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    full_name: "",
    company: "",
    phone: "",
    loan_amount: "",
    product: "",
    application_status: "",
    relationship_manager: "",
    relationship_manager_phone: "",
    expected_approval_date: "",
    progress: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!open) {
    return null;
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    // Validate required fields
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.full_name
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            full_name: formData.full_name,
            company: formData.company || null,
            phone: formData.phone || null,
            loan_amount: formData.loan_amount
              ? Number(formData.loan_amount)
              : null,
            product: formData.product || null,
            application_status:
              formData.application_status || null,
            relationship_manager:
              formData.relationship_manager || null,
            relationship_manager_phone:
              formData.relationship_manager_phone || null,
            expected_approval_date:
              formData.expected_approval_date || null,
            progress: formData.progress
              ? Number(formData.progress)
              : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Failed to create merchant."
        );
        setLoading(false);
        return;
      }

      setSuccessMessage(
        `Merchant created successfully!\n${result.customer.full_name} (${result.customer.username})`
      );

      setTimeout(() => {
        setFormData({
          username: "",
          password: "",
          email: "",
          full_name: "",
          company: "",
          phone: "",
          loan_amount: "",
          product: "",
          application_status: "",
          relationship_manager: "",
          relationship_manager_phone: "",
          expected_approval_date: "",
          progress: "",
        });
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold">
              Create Merchant
            </h2>

            <p className="mt-2 text-slate-500">
              Add a new merchant account to Verdyra
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* LOGIN SECTION */}
          <div>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Login Credentials
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <input
                type="text"
                name="username"
                placeholder="Username *"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

            </div>

          </div>

          {/* MERCHANT SECTION */}
          <div>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Merchant Details
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <input
                type="text"
                name="full_name"
                placeholder="Full Name *"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

            </div>

          </div>

          {/* APPLICATION SECTION */}
          <div>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Application Details
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              <input
                type="number"
                name="loan_amount"
                placeholder="Loan Amount (₹)"
                value={formData.loan_amount}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <select
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50 text-slate-600"
              >
                <option value="">Select Product</option>
                <option value="Business Loan">
                  Business Loan
                </option>
                <option value="Personal Loan">
                  Personal Loan
                </option>
              </select>

              <select
                name="application_status"
                value={formData.application_status}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50 text-slate-600"
              >
                <option value="">Select Status</option>
                <option value="Application Received">
                  Application Received
                </option>
                <option value="In Review">
                  In Review
                </option>
                <option value="Approved">
                  Approved
                </option>
                <option value="Rejected">
                  Rejected
                </option>
              </select>

              <input
                type="text"
                name="relationship_manager"
                placeholder="Relationship Manager"
                value={formData.relationship_manager}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="tel"
                name="relationship_manager_phone"
                placeholder="RM Phone"
                value={formData.relationship_manager_phone}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="date"
                name="expected_approval_date"
                value={formData.expected_approval_date}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

              <input
                type="number"
                name="progress"
                placeholder="Progress (%)"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-50"
              />

            </div>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600 whitespace-pre-line">
              {successMessage}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border px-6 py-3 font-medium disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#0F5A3A] px-8 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Merchant
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
