"use client";

import {
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  Download,
} from "lucide-react";

import type { CustomerDocument } from "@/lib/documents/documentService";

type Props = {
  title: string;
  documentType: string;
  document?: CustomerDocument;
  onUpload: (documentType: string) => void;
  onPreview: (document: CustomerDocument) => void;
  templateUrl?: string;
};

export default function DocumentCard({
  title,
  documentType,
  document,
  onUpload,
  onPreview,
  templateUrl,
}: Props) {
  function renderStatus() {
    if (!document) {
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Not Uploaded
        </span>
      );
    }

    switch (document.status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <XCircle size={14} />
            Rejected
          </span>
        );

      case "Re-upload Required":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            <RotateCcw size={14} />
            Re-upload Required
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <Clock3 size={14} />
            Pending
          </span>
        );
    }
  }

  function handleDownloadTemplate() {
    if (templateUrl) {
      const link = window.document.createElement("a");
      link.href = templateUrl;
      link.download = "";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F7F4]">

          <FileText
            size={28}
            className="text-[#0F5A3A]"
          />

        </div>

        {renderStatus()}

      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      {document ? (
        <>
          <p className="mt-2 truncate text-sm text-slate-500">
            {document.file_name}
          </p>

          <div className="mt-6 flex gap-3">

            <button
              onClick={() => onPreview(document)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-medium hover:bg-slate-50"
            >
              <Eye size={18} />
              Preview
            </button>

            <button
              onClick={() => onUpload(documentType)}
              className="rounded-xl bg-[#0F5A3A] px-5 text-white hover:bg-[#0B4B31]"
            >
              Replace
            </button>

            {templateUrl && (
              <button
                onClick={handleDownloadTemplate}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-medium hover:bg-slate-50"
              >
                <Download size={18} />
                Download Template
              </button>
            )}

          </div>
        </>
      ) : (
        <div className="mt-8 space-y-3">
          {templateUrl && (
            <button
              onClick={handleDownloadTemplate}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={18} />
              Download Template
            </button>
          )}
          <button
            onClick={() => onUpload(documentType)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0F5A3A] py-4 font-semibold text-white transition hover:bg-[#0B4B31]"
          >
            <Upload size={18} />
            Upload Document
          </button>
        </div>
      )}

    </div>
  );
}
