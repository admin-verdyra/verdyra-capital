"use client";

import { usePortal } from "@/components/portal/PortalProvider";
import type { Customer } from "@/components/portal/types";
import Card from "@/components/ui/Card";

function ProfilePage() {
  const { customer } = usePortal();

  if (!customer) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F5A3A]" />
      </div>
    );
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "Not provided";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not provided";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-slate-100 text-slate-600";
    const s = status.toLowerCase();
    if (s.includes("approved")) return "bg-green-100 text-green-700";
    if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("rejected") || s.includes("declined")) return "bg-red-100 text-red-700";
    if (s.includes("review")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-2 text-slate-500">Your account and application information.</p>
      </div>

      {/* Customer Information */}
      <Card className="rounded-2xl border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              Customer Information
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Personal Details</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7F2] text-xl">
            👤
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Full Name</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">
              {customer.full_name || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Username</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">
              {customer.username || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">
              {customer.email || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Phone</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">
              {customer.phone || "Not provided"}
            </p>
          </div>
        </div>
      </Card>

      {/* Business Information */}
      {(customer.company || customer.product) && (
        <Card className="rounded-2xl border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                Business Information
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Company Details</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7F2] text-xl">
              🏢
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {customer.company && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business / Company Name</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.company}
                </p>
              </div>
            )}

            {customer.product && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business Type / Category</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.product}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Funding Information */}
      {(customer.loan_amount || customer.product || customer.application_status) && (
        <Card className="rounded-2xl border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                Funding Information
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Application Details</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7F2] text-xl">
              💰
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {customer.product && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Product</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.product}
                </p>
              </div>
            )}

            {customer.loan_amount !== null && customer.loan_amount !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Loan / Funding Amount</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {formatCurrency(customer.loan_amount)}
                </p>
              </div>
            )}

            {customer.application_status && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Application Status</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(customer.application_status)}`}>
                    {customer.application_status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Relationship Manager */}
      {(customer.relationship_manager || customer.relationship_manager_phone) && (
        <Card className="rounded-2xl border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                Relationship Manager
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Your Dedicated Contact</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7F2] text-xl">
              🤝
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {customer.relationship_manager && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Relationship Manager</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.relationship_manager}
                </p>
              </div>
            )}

            {customer.relationship_manager_email && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Relationship Manager Email</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.relationship_manager_email}
                </p>
              </div>
            )}

            {customer.relationship_manager_phone && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Relationship Manager Phone</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {customer.relationship_manager_phone}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Additional Info - Date of Birth, Expected Approval Date, Progress */}
      {(customer.date_of_birth || customer.expected_approval_date || customer.progress !== null) && (
        <Card className="rounded-2xl border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
                Additional Information
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">Other Details</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7F2] text-xl">
              📋
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {customer.date_of_birth && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Date of Birth</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {formatDate(customer.date_of_birth)}
                </p>
              </div>
            )}

            {customer.expected_approval_date && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Expected Approval Date</p>
                <p className="mt-2 break-words text-base font-semibold text-slate-900">
                  {formatDate(customer.expected_approval_date)}
                </p>
              </div>
            )}

            {customer.progress !== null && customer.progress !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-[#F8FAF9] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Application Progress</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-semibold text-slate-900">{customer.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-[#0F5A3A] rounded-full transition-all duration-500"
                      style={{ width: `${customer.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default ProfilePage;