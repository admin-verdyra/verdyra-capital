"use client";

import { DOCUMENTS } from "@/components/portal/types";
import type { CustomerDocument } from "@/lib/documents/documentService";
import DocumentCard from "./DocumentCard";

type Props = {
  documents: CustomerDocument[];
  onUpload: (documentType: string) => void;
  onPreview: (document: CustomerDocument) => void;
};

export default function DocumentGrid({
  documents,
  onUpload,
  onPreview,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {DOCUMENTS.map((item) => {
        const uploaded = documents.filter(
          (d) => d.document_type === item.id
        );

        return (
          <DocumentCard
            key={item.id}
            title={item.label}
            documentType={item.id}
            documents={uploaded}
            onUpload={onUpload}
            onPreview={onPreview}
            templateUrl={
              item.id === "debt_profile"
                ? "/templates/Debt%20profile.xlsx"
                : item.id === "mis"
                ? "/templates/MIS%20Format.xlsx"
                : undefined
            }
          />
        );
      })}
    </div>
  );
}