"use client";

import { useDocumentsContext } from "./DocumentsProvider";

export default function useDocuments() {
  return useDocumentsContext();
}