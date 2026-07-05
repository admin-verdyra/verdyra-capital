"use client";

import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";

import useDocuments from "./useDocuments";

import type { CustomerDocument } from "@/lib/documents/documentService";

type Props = {
  document: CustomerDocument | null;
  open: boolean;
  onClose: () => void;
};

export default function DocumentPreview({
  document,
  open,
  onClose,
}: Props) {
  const { getPreviewUrl } = useDocuments();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !document) {
      setUrl("");
      return;
    }

    async function loadPreview(doc: CustomerDocument) {
      try {
        setLoading(true);

        const signedUrl = await getPreviewUrl(
          doc.file_path
        );

        setUrl(signedUrl);
      } finally {
        setLoading(false);
      }
    }

    loadPreview(document);
  }, [open, document, getPreviewUrl]);

  if (!open || !document) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold">
              {document.file_name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
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
                  className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium hover:bg-slate-50"
                >
                  <ExternalLink size={18} />
                  Open
                </a>

                <a
                  href={url}
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F5A3A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B4B31]"
                >
                  <Download size={18} />
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
                size={24}
                className="animate-spin"
              />

              <span className="font-medium">
                Loading Preview...
              </span>
            </div>
          ) : url ? (
            <iframe
              src={url}
              className="h-full w-full"
              title="Document Preview"
            />
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold">
                Unable to load preview.
              </p>

              <p className="mt-2 text-slate-500">
                Please try again later.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}