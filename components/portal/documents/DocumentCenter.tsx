"use client";

import { useEffect, useState } from "react";

import { usePortal } from "@/components/portal/PortalProvider";

import { DocumentsProvider } from "./DocumentsProvider";
import useDocuments from "./useDocuments";

import DocumentHero from "./DocumentHero";
import DocumentGrid from "./DocumentGrid";
import UploadDocumentModal from "./UploadDocumentModal";
import DocumentPreview from "./DocumentPreview";

import type { CustomerDocument } from "@/lib/documents/documentService";

function DocumentContent() {
  const { customer } = usePortal();

  const {
    documents,
    loading,
    refreshDocuments,
  } = useDocuments();

  const [uploadType, setUploadType] =
    useState<string | null>(null);

  const [previewDocument, setPreviewDocument] =
    useState<CustomerDocument | null>(null);

  useEffect(() => {
    if (!customer) return;

    refreshDocuments(customer.username);
  }, [customer]);

  if (!customer) {
    return null;
  }

  return (
    <div className="space-y-8">

      <DocumentHero />

      {loading ? (
        <div className="rounded-3xl bg-white p-16 text-center">

          <p className="text-lg font-semibold">
            Loading documents...
          </p>

        </div>
      ) : (
        <DocumentGrid
          documents={documents}
          onUpload={setUploadType}
          onPreview={setPreviewDocument}
        />
      )}

      <UploadDocumentModal
        open={uploadType !== null}
        documentType={uploadType}
        onClose={() => {
          setUploadType(null);

          refreshDocuments(customer.username);
        }}
      />

      <DocumentPreview
  open={previewDocument !== null}
  document={previewDocument}
  onClose={() => setPreviewDocument(null)}
/>

    </div>
  );
}

export default function DocumentCenter() {
  return (
    <DocumentsProvider>
      <DocumentContent />
    </DocumentsProvider>
  );
}