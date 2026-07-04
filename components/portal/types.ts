export type Customer = {
  username: string;
  password: string;
  full_name: string;
  email: string;
};

export type DocumentDefinition = {
  id: string;
  label: string;
  storagePrefix: string;
};

export type UploadedDocument = {
  fileName: string;
  uploadedAt: string;
};

export const DOCUMENTS: DocumentDefinition[] = [
  {
    id: "aadhaar",
    label: "Aadhaar Card",
    storagePrefix: "aadhaar-card",
  },
  {
    id: "pan",
    label: "PAN Card",
    storagePrefix: "pan-card",
  },
  {
    id: "gst",
    label: "GST Certificate",
    storagePrefix: "gst-certificate",
  },
  {
    id: "bank",
    label: "Bank Statements",
    storagePrefix: "bank-statements",
  },
  {
    id: "financial",
    label: "Financial Statements",
    storagePrefix: "financial-statements",
  },
  {
    id: "additional",
    label: "Additional Documents",
    storagePrefix: "additional-documents",
  },
];