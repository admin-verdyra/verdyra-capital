export type Customer = {
  username: string;
  password: string;

  full_name: string;
  email: string;

  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  relationship_manager: string | null;
  expected_approval_date: string | null;
  progress: number | null;
};

export type DocumentDefinition = {
  id: string;
  label: string;
  description: string;
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
    description: "Government issued identity proof",
    storagePrefix: "aadhaar-card",
  },
  {
    id: "pan",
    label: "PAN Card",
    description: "Permanent Account Number",
    storagePrefix: "pan-card",
  },
  {
    id: "gst",
    label: "GST Certificate",
    description: "Business GST registration certificate",
    storagePrefix: "gst-certificate",
  },
  {
    id: "bank",
    label: "Bank Statements",
    description: "Latest 6 months bank statements",
    storagePrefix: "bank-statements",
  },
  {
    id: "financial",
    label: "Financial Statements",
    description: "P&L and Balance Sheet",
    storagePrefix: "financial-statements",
  },
  {
    id: "additional",
    label: "Additional Documents",
    description: "Any supporting documents",
    storagePrefix: "additional-documents",
  },
];