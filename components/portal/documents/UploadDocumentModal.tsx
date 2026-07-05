"use client";

type Props = {
  open?: boolean;
  documentType?: string | null;
  onClose?: () => void;
};

export default function UploadDocumentModal({
  open,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="rounded-xl bg-white p-8">
        Upload Modal
      </div>
    </div>
  );
}