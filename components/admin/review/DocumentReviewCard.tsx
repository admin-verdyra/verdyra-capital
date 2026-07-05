"use client";

import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
  Eye,
} from "lucide-react";

import type { CustomerDocument } from "@/lib/documents/documentService";

type Props = {
  document: CustomerDocument;
  onPreview: (document: CustomerDocument) => void;
  onApprove: (document: CustomerDocument) => void;
  onReject: (document: CustomerDocument) => void;
  onReupload: (document: CustomerDocument) => void;
};

export default function DocumentReviewCard({
  document,
  onPreview,
  onApprove,
  onReject,
  onReupload,
}: Props) {
  function statusBadge() {
    switch (document.status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={16} />
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
            <XCircle size={16} />
            Rejected
          </span>
        );

      case "Re-upload Required":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
            <RotateCcw size={16} />
            Re-upload Required
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            <Clock3 size={16} />
            Pending
          </span>
        );
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-xl font-bold capitalize">
            {document.document_type.replace(/_/g, " ")}
          </h3>

          <p className="mt-2 text-slate-500">
            {document.file_name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Uploaded{" "}
            {new Date(document.uploaded_at).toLocaleString()}
          </p>

        </div>

        {statusBadge()}

      </div>

      {document.remarks && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Remarks
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {document.remarks}
          </p>

        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">

        <button
          onClick={() => onPreview(document)}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <Eye className="mr-2 inline" size={16} />
          Preview
        </button>

        <button
          onClick={() => onApprove(document)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Approve
        </button>

        <button
          onClick={() => onReject(document)}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reject
        </button>

        <button
          onClick={() => onReupload(document)}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Re-upload
        </button>

      </div>

    </div>
  );
}