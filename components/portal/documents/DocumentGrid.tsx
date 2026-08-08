"use client";

import type { CustomerDocument } from "@/lib/documents/documentService";
import DocumentCard from "./DocumentCard";

type Props = {
  documents: CustomerDocument[];
  onUpload: (documentType: string) => void;
  onPreview: (document: CustomerDocument) => void;
};

const requiredDocuments = [
  {
    type: "aadhaar",
    label: "Aadhaar Card",
  },
  {
    type: "pan",
    label: "PAN Card",
  },
  {
    type: "gst",
    label: "GST Certificate",
  },
  {
    type: "bank",
    label: "Bank Statements",
  },
  {
    type: "financial",
    label: "Financial Statements",
  },
  {
    type: "additional",
    label: "Additional Documents",
  },
  {
    type: "debt_profile",
    label: "Debt Profile",
    templateUrl: "/templates/Debt%20profile.xlsx",
  },
  {
    type: "mis",
    label: "MIS",
    templateUrl: "/templates/MIS%20Format.xlsx",
  },
];

export default function DocumentGrid({
  documents,
  onUpload,
  onPreview,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {requiredDocuments.map((item) => {
        const uploaded = documents.find(
          (d) => d.document_type === item.type
        );

        return (
          <DocumentCard
            key={item.type}
            title={item.label}
            documentType={item.type}
            document={uploaded}
            onUpload={onUpload}
            onPreview={onPreview}
            templateUrl={item.templateUrl}
          />
        );
      })}
    </div>
  );
}