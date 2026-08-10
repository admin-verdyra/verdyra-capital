"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  ExternalLink,
  Download,
} from "lucide-react";

import type { CustomerDocument } from "@/lib/documents/documentService";

type Props = {
  open: boolean;
  document: CustomerDocument | null;
  onClose: () => void;
};

export default function ReviewPreviewModal({
  open,
  document,
  onClose,
}: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !document) {
      setUrl("");
      return;
    }

    async function load(doc: CustomerDocument) {
      try {
        setLoading(true);

        const response = await fetch(`/api/admin/documents/signed-url?document_id=${encodeURIComponent(doc.id)}`, {
          method: "GET",
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message ?? "Failed to generate signed URL.");
        }

        setUrl(result.signed_url);
      } finally {
        setLoading(false);
      }
    }

    load(document);
  }, [open, document]);

  if (!open || !document) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-8">
      <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold">
              {document.file_name}
            </h2>

            <p className="mt-1 text-slate-500">
              {document.document_type}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {url && (
              <>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  <ExternalLink
                    size={16}
                    className="mr-2 inline"
                  />
                  Open
                </a>

                <a
                  href={url}
                  download
                  className="rounded-xl bg-[#0F5A3A] px-5 py-3 text-sm font-semibold text-white"
                >
                  <Download
                    size={16}
                    className="mr-2 inline"
                  />
                  Download
                </a>
              </>
            )}

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <X size={24} />
            </button>

          </div>

        </div>

        <div className="flex flex-1 items-center justify-center bg-slate-100">

          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2
                className="animate-spin"
                size={24}
              />
              <span>Loading Preview...</span>
            </div>
          ) : url ? (
            <iframe
              src={url}
              className="h-full w-full"
              title="Preview"
            />
          ) : (
            <div>No Preview Available</div>
          )}

        </div>

      </div>
    </div>
  );
}