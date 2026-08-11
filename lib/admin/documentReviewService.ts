import type { CustomerDocument } from "@/lib/documents/documentService";

export async function getCustomerDocumentsForReview(
  username: string
): Promise<CustomerDocument[]> {
  const response = await fetch(`/api/admin/documents?username=${encodeURIComponent(username)}`, {
    method: "GET",
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message ?? "Failed to fetch documents.");
  }

  return result.documents as CustomerDocument[];
}

export async function reviewDocument(
  documentId: string,
  status:
    | "Approved"
    | "Rejected"
    | "Re-upload Required",
  reviewer: string,
  remarks: string
) {
  const response = await fetch("/api/admin/documents", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      status,
      reviewer,
      remarks,
    }),
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message ?? "Failed to review document.");
  }
}
