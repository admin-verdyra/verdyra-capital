"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";

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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!open || !documentType) {
    return null;
  }

  async function handleFiles(
    files: FileList | File[]
  ) {
    if (!customer) return;

    setError("");

    const allowedTypes = getAllowedTypes(documentType!);

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `Only ${getFileTypeDescription(documentType!)} files are allowed.`
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Maximum file size is 10 MB.");
        return;
      }
    }

    setSelectedFiles(fileArray);

    try {
      setUploading(true);

      for (const file of fileArray) {
        await uploadCustomerDocument(
          customer.username,
          documentType!,
          file
        );
      }

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setSelectedFiles([]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
            disabled={uploading}
            className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>

        </div>

        <button
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="mt-8 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 py-16 transition hover:border-[#0F5A3A] hover:bg-[#F8FBF9] disabled:opacity-50 disabled:cursor-not-allowed"
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

          <p className="mt-1 text-sm text-slate-400">
            Multiple files allowed
          </p>

        </button>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={getAcceptString(documentType!)}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              handleFiles(files);
            }
          }}
        />

        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-slate-700">
              Selected files ({selectedFiles.length}):
            </p>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Upload
                      size={18}
                      className="text-[#0F5A3A] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="rounded-full p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

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

          {selectedFiles.length > 0 && !uploading && (
            <button
              onClick={() => handleFiles(selectedFiles)}
              className="rounded-xl bg-[#0F5A3A] px-6 py-3 font-semibold text-white hover:bg-[#0B4B31]"
            >
              <CheckCircle2 size={18} className="mr-2 inline" />
              Upload {selectedFiles.length} File{selectedFiles.length > 1 ? "s" : ""}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}