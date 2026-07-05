import { supabase } from "@/lib/supabase";

export type CustomerDocument = {
  id: string;
  customer_username: string;
  document_type: string;
  file_name: string;
  file_path: string;
  status: string;
  uploaded_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  remarks: string | null;
};

const BUCKET = "documents";

export async function uploadDocument(
  username: string,
  documentType: string,
  file: File
) {
  const extension = file.name.split(".").pop();

  const fileName = `${documentType}.${extension}`;

  const storagePath = `${username}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: dbError } = await supabase
    .from("customer_documents")
    .upsert({
      customer_username: username,
      document_type: documentType,
      file_name: file.name,
      file_path: storagePath,
      status: "Pending",
      uploaded_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      remarks: null,
    });

  if (dbError) {
    throw dbError;
  }
}

export async function getCustomerDocuments(
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

  return data as CustomerDocument[];
}

export async function getSignedUrl(
  filePath: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 30);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

export async function updateDocumentStatus(
  id: string,
  status:
    | "Approved"
    | "Rejected"
    | "Re-upload Required",
  reviewedBy: string,
  remarks?: string
) {
  const { error } = await supabase
    .from("customer_documents")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      remarks: remarks ?? null,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteDocument(
  document: CustomerDocument
) {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([document.file_path]);

  if (storageError) {
    throw storageError;
  }

  const { error: dbError } = await supabase
    .from("customer_documents")
    .delete()
    .eq("id", document.id);

  if (dbError) {
    throw dbError;
  }
}