"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { CustomerDocument } from "@/lib/documents/documentService";

import {
  getCustomerDocuments,
  uploadDocument,
  deleteDocument,
  getSignedUrl,
} from "@/lib/documents/documentService";

type DocumentsContextType = {
  documents: CustomerDocument[];
  loading: boolean;

  refreshDocuments: (username: string) => Promise<void>;

  uploadCustomerDocument: (
    username: string,
    documentType: string,
    file: File
  ) => Promise<void>;

  deleteCustomerDocument: (
    document: CustomerDocument
  ) => Promise<void>;

  getPreviewUrl: (
    filePath: string
  ) => Promise<string>;
};

const DocumentsContext =
  createContext<DocumentsContextType | null>(null);

export function DocumentsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [documents, setDocuments] = useState<
    CustomerDocument[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  async function refreshDocuments(
    username: string
  ) {
    setLoading(true);

    try {
      const docs =
        await getCustomerDocuments(username);

      setDocuments(docs);
    } finally {
      setLoading(false);
    }
  }

  async function uploadCustomerDocument(
    username: string,
    documentType: string,
    file: File
  ) {
    await uploadDocument(
      username,
      documentType,
      file
    );

    await refreshDocuments(username);
  }

  async function deleteCustomerDocument(
    document: CustomerDocument
  ) {
    await deleteDocument(document);

    await refreshDocuments(
      document.customer_username
    );
  }

  async function getPreviewUrl(
    filePath: string
  ) {
    return getSignedUrl(filePath);
  }

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        loading,
        refreshDocuments,
        uploadCustomerDocument,
        deleteCustomerDocument,
        getPreviewUrl,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocumentsContext() {
  const context =
    useContext(DocumentsContext);

  if (!context) {
    throw new Error(
      "useDocumentsContext must be used inside DocumentsProvider."
    );
  }

  return context;
}