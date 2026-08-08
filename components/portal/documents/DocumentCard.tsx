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
  File,
} from "lucide-react";

import type { CustomerDocument } from "@/lib/documents/documentService";

type Props = {
  title: string;
  documentType: string;
  documents?: CustomerDocument[];
  onUpload: (documentType: string) => void;
  onPreview: (document: CustomerDocument) => void;
  templateUrl?: string;
};

export default function DocumentCard({
  title,
  documentType,
  documents,
  onUpload,
  onPreview,
  templateUrl,
}: Props) {
  const document = documents?.[0];

  function renderStatus() {
    if (!documents || documents.length === 0) {
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Not Uploaded
        </span>
      );
    }

    // Show the "worst" status among all files
    const statuses = documents.map((d) => d.status);
    if (statuses.includes("Rejected")) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }
    if (statuses.includes("Re-upload Required")) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          <RotateCcw size={14} />
          Re-upload Required
        </span>
      );
    }
    if (statuses.includes("Pending")) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          <Clock3 size={14} />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={14} />
        Approved
      </span>
    );
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

      {documents && documents.length > 0 ? (
        <>
          <div className="mt-4 space-y-2">
            {documents.map((doc, index) => (
              <div
                key={`${doc.id}-${index}`}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <File size={18} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreview(doc)}
                    className="rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-slate-100 transition"
                  >
                    <Eye size={14} className="mr-1 inline" />
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onUpload(documentType)}
              className="rounded-xl bg-[#0F5A3A] px-5 text-white hover:bg-[#0B4B31]"
            >
              Add More
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