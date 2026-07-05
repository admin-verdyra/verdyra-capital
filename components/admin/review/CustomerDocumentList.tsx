"use client";

import { useEffect, useState } from "react";

import type { CustomerDocument } from "@/lib/documents/documentService";

import {
  getCustomerDocumentsForReview,
  reviewDocument,
} from "@/lib/admin/documentReviewService";

import DocumentReviewCard from "./DocumentReviewCard";
import ReviewPreviewModal from "./ReviewPreviewModal";
import ReviewDecisionModal from "./ReviewDecisionModal";

type Customer = {
  username: string;
  full_name: string;
  email: string;
  application_status: string | null;
};

type Props = {
  customer: Customer | null;
};

export default function CustomerDocumentList({
  customer,
}: Props) {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const [previewDocument, setPreviewDocument] =
    useState<CustomerDocument | null>(null);

  const [decisionDocument, setDecisionDocument] =
    useState<CustomerDocument | null>(null);

  const [saving, setSaving] = useState(false);

  async function loadDocuments(username: string) {
    try {
      setLoading(true);

      const data =
        await getCustomerDocumentsForReview(username);

      setDocuments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!customer) {
      setDocuments([]);
      return;
    }

    loadDocuments(customer.username);
  }, [customer]);

  async function handleDecision(
    status:
      | "Approved"
      | "Rejected"
      | "Re-upload Required",
    remarks: string
  ) {
    if (!decisionDocument || !customer) return;

    try {
      setSaving(true);

      await reviewDocument(
        decisionDocument.id,
        status,
        "Admin",
        remarks
      );

      await loadDocuments(customer.username);

      setDecisionDocument(null);
    } finally {
      setSaving(false);
    }
  }

  if (!customer) {
    return (
      <div className="flex min-h-[650px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Select a Customer
          </h2>

          <p className="mt-3 text-slate-500">
            Choose a customer from the left panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-8">

          <h2 className="text-2xl font-bold">
            {customer.full_name}
          </h2>

          <p className="mt-2 text-slate-500">
            {customer.email}
          </p>

        </div>

        <div className="space-y-6 p-8">

          {loading ? (
            <div className="py-20 text-center">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              No documents uploaded.
            </div>
          ) : (
            documents.map((document) => (
              <DocumentReviewCard
                key={document.id}
                document={document}
                onPreview={setPreviewDocument}
                onApprove={setDecisionDocument}
                onReject={setDecisionDocument}
                onReupload={setDecisionDocument}
              />
            ))
          )}

        </div>

      </div>

      <ReviewPreviewModal
        open={previewDocument !== null}
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
      />

      <ReviewDecisionModal
        open={decisionDocument !== null}
        title={
          decisionDocument?.document_type ?? ""
        }
        loading={saving}
        onClose={() =>
          setDecisionDocument(null)
        }
        onSubmit={handleDecision}
      />
    </>
  );
}