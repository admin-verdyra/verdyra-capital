"use client";

import type {
  DocumentDefinition,
  UploadedDocument,
} from "./types";

import DocumentHero from "./documents/DocumentHero";
import DocumentUploadCard from "./documents/DocumentUploadCard";

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
  const uploadedCount = Object.keys(documentsById).length;

  const totalDocuments = documents.length;

  const progress = Math.round(
    (uploadedCount / totalDocuments) * 100
  );

  return (
    <div className="space-y-8">

      <DocumentHero />

      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Progress
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {uploadedCount} of {totalDocuments} Documents Uploaded
            </h2>

          </div>

          <div className="w-full lg:w-80">

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-[#0F5A3A] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-3 text-right text-sm font-semibold text-slate-600">
              {progress}% Complete
            </p>

          </div>

        </div>

      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {documents.map((document) => (

          <DocumentUploadCard
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