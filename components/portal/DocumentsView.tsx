"use client";

import type {
  DocumentDefinition,
  UploadedDocument,
} from "./types";

import DocumentCard from "./DocumentCard";

type Props = {
  documents: DocumentDefinition[];
  documentsById: Record<string, UploadedDocument>;
  uploadingId: string | null;
  onUpload: (
    document: DocumentDefinition,
    file: File
  ) => void;
};

export default function DocumentsView({
  documents,
  documentsById,
  uploadingId,
  onUpload,
}: Props) {
  return (
    <div className="space-y-8">

      <section className="rounded-[28px] bg-gradient-to-r from-[#0F5A3A] to-[#1D7C55] p-8 text-white shadow-xl">

        <p className="text-sm uppercase tracking-[0.25em] text-white/80">
          Secure Upload
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Documents
        </h1>

        <p className="mt-4 max-w-2xl text-white/80">
          Upload your KYC and financial documents securely.
          Your Relationship Manager will review them.
        </p>

      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {documents.map((document) => (

          <DocumentCard
            key={document.id}
            document={document}
            uploadedDocument={documentsById[document.id]}
            isUploading={uploadingId === document.id}
            onUpload={(file) => onUpload(document, file)}
          />

        ))}

      </div>

    </div>
  );
}