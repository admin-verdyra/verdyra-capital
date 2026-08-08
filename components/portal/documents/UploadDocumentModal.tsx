"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

import { usePortal } from "@/components/portal/PortalProvider";
import useDocuments from "./useDocuments";

type Props = {
  open: boolean;
  documentType: string | null;
  onClose: () => void;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

function getAllowedTypes(documentType: string) {
  if (documentType === "debt_profile" || documentType === "mis") {
    return [...ALLOWED_TYPES, ...EXCEL_TYPES];
  }
  return ALLOWED_TYPES;
}

function getAcceptString(documentType: string) {
  if (documentType === "debt_profile" || documentType === "mis") {
    return ".pdf,.jpg,.jpeg,.png,.xlsx,.xls";
  }
  return ".pdf,.jpg,.jpeg,.png";
}

function getFileTypeDescription(documentType: string) {
  if (documentType === "debt_profile" || documentType === "mis") {
    return "PDF, JPG, PNG, XLSX or XLS";
  }
  return "PDF, JPG or PNG";
}

export default function UploadDocumentModal({
  open,
  documentType,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { customer } = usePortal();

  const { uploadCustomerDocument } =
    useDocuments();

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open || !documentType) {
    return null;
  }

  async function handleFile(
    file: File
  ) {
    if (!customer) return;

    setError("");

    const allowedTypes = getAllowedTypes(documentType!);

    if (
      !allowedTypes.includes(file.type)
    ) {
      setError(
        `Only ${getFileTypeDescription(documentType!)} files are allowed.`
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Maximum file size is 10 MB."
      );

      return;
    }

    try {
      setUploading(true);

      await uploadCustomerDocument(
        customer.username,
        documentType!,
        file
      );

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Upload Document
            </h2>

            <p className="mt-2 text-slate-500">
              {documentType}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <button
          onClick={() =>
            inputRef.current?.click()
          }
          className="mt-8 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 py-16 transition hover:border-[#0F5A3A] hover:bg-[#F8FBF9]"
        >

          <Upload
            size={48}
            className="text-[#0F5A3A]"
          />

          <h3 className="mt-5 text-xl font-semibold">
            Select Document
          </h3>

          <p className="mt-2 text-slate-500">
            {getFileTypeDescription(documentType!)}
          </p>

        </button>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={getAcceptString(documentType!)}
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (file) {
              handleFile(file);
            }
          }}
        />

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {uploading && (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-xl bg-[#F3F7F4] py-5">

            <Loader2
              size={20}
              className="animate-spin text-[#0F5A3A]"
            />

            <span className="font-medium">
              Uploading...
            </span>

          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={uploading}
            className="rounded-xl border px-6 py-3 font-medium"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}