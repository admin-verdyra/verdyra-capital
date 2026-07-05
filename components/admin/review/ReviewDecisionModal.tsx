"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

type ReviewStatus =
  | "Approved"
  | "Rejected"
  | "Re-upload Required";

type Props = {
  open: boolean;
  title: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    status: ReviewStatus,
    remarks: string
  ) => Promise<void>;
};

export default function ReviewDecisionModal({
  open,
  title,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [status, setStatus] =
    useState<ReviewStatus>("Approved");

  const [remarks, setRemarks] =
    useState("");

  if (!open) return null;

  async function handleSubmit() {
    await onSubmit(status, remarks);

    setRemarks("");
    setStatus("Approved");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-6">

      <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold">
              Review Document
            </h2>

            <p className="mt-2 text-slate-500">
              {title}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-8 p-8">

          <div>

            <label className="mb-3 block text-sm font-semibold">
              Decision
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as ReviewStatus
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0F5A3A]"
            >
              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Re-upload Required">
                Re-upload Required
              </option>

            </select>

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold">
              Remarks
            </label>

            <textarea
              rows={5}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Add remarks for the customer..."
              className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-[#0F5A3A]"
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-[#0F5A3A] px-6 py-3 font-semibold text-white hover:bg-[#0B4B31]"
          >
            {loading ? (
              <span className="flex items-center gap-2">

                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...

              </span>
            ) : (
              "Save Decision"
            )}

          </button>

        </div>

      </div>

    </div>
  );
}