import { supabase } from "@/lib/supabase";
import type { CustomerDocument } from "@/lib/documents/documentService";

export async function getCustomerDocumentsForReview(
  username: string
): Promise<CustomerDocument[]> {
  const { data, error } = await supabase
    .from("customer_documents")
    .select("*")
    .eq("customer_username", username)
    .order("uploaded_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomerDocument[];
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
  const { error } = await supabase
    .from("customer_documents")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewer,
      remarks,
    })
    .eq("id", documentId);

  if (error) {
    throw error;
  }
}