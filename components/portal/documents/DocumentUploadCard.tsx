"use client";

import { useRef } from "react";
import {
  CheckCircle2,
  Clock3,
  UploadCloud,
  Eye,
  RefreshCcw,
} from "lucide-react";

import type {
  DocumentDefinition,
  UploadedDocument,
} from "../types";

type Props = {
  document: DocumentDefinition;
  uploadedDocument?: UploadedDocument;
  isUploading: boolean;
  onUpload: (file: File) => void;
};

export default function DocumentUploadCard({
  document,
  uploadedDocument,
  isUploading,
  onUpload,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploaded = !!uploadedDocument;

  return (
    <div className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-xl font-bold text-slate-900">
            {document.label}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {document.description}
          </p>

        </div>

        {uploaded ? (
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            Uploaded
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <Clock3 size={18} />
            Pending
          </div>
        )}

      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

        {uploaded ? (
          <>
            <CheckCircle2
              className="mx-auto text-emerald-500"
              size={44}
            />

            <p className="mt-4 font-semibold">
              {uploadedDocument.fileName}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successfully uploaded
            </p>
          </>
        ) : (
          <>
            <UploadCloud
              className="mx-auto text-slate-400"
              size={44}
            />

            <p className="mt-4 font-semibold">
              Click below to upload
            </p>

            <p className="mt-1 text-sm text-slate-500">
              PDF, JPG or PNG
            </p>
          </>
        )}

      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onUpload(file);
          }
        }}
      />

      <div className="mt-8 flex gap-3">

        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 rounded-2xl bg-[#0F5A3A] px-5 py-4 font-semibold text-white transition hover:bg-[#0B4B31] disabled:opacity-50"
        >
          {uploaded
            ? "Replace Document"
            : isUploading
            ? "Uploading..."
            : "Upload Document"}
        </button>

        {uploaded && (
          <button
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 transition hover:bg-slate-50"
          >
            <Eye size={20} />
          </button>
        )}

        {uploaded && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 transition hover:bg-slate-50"
          >
            <RefreshCcw size={20} />
          </button>
        )}

      </div>

    </div>
  );
}