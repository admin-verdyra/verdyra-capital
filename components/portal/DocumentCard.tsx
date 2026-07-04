"use client";

import type {
  DocumentDefinition,
  UploadedDocument,
} from "./types";

type Props = {
  document: DocumentDefinition;
  uploadedDocument?: UploadedDocument;
  isUploading: boolean;
  onUpload: (file: File) => void;
};

export default function DocumentCard({
  document,
  uploadedDocument,
  isUploading,
  onUpload,
}: Props) {
  return (
    <div className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8860B]/40 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-semibold text-[#111111]">
            {document.label}
          </h3>

          <p className="mt-2 text-sm font-medium">

            {uploadedDocument ? (
              <span className="text-emerald-600">
                ✓ Uploaded
              </span>
            ) : (
              <span className="text-amber-600">
                Pending Upload
              </span>
            )}

          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            uploadedDocument
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {uploadedDocument ? "Complete" : "Pending"}
        </span>

      </div>

      <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-4">

        {uploadedDocument ? (
          <>
            <p className="truncate text-sm font-semibold text-[#111111]">
              {uploadedDocument.fileName}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Uploaded on {uploadedDocument.uploadedAt}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            No document uploaded yet.
          </p>
        )}

      </div>

      <div className="mt-6 flex gap-2">

        <label className="flex-1 cursor-pointer rounded-full bg-[#0F5A3A] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0B472F]">

          {isUploading ? "Uploading..." : uploadedDocument ? "Replace" : "Upload"}

          <input
            type="file"
            className="hidden"
            disabled={isUploading}
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onUpload(file);
              }

              event.target.value = "";
            }}
          />

        </label>

        {uploadedDocument && (
          <button
            type="button"
            className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View
          </button>
        )}

      </div>

    </div>
  );
}