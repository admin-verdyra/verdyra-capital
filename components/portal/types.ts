export type Customer = {
  auth_user_id?: string | null;

  username: string;

  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  date_of_birth: string | null;

  loan_amount: number | null;
  product: string | null;
  application_status: string | null;
  account_status: 'active' | 'disabled';
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
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
    id: "msme",
    label: "MSME Certificate",
    description: "MSME registration certificate",
    storagePrefix: "msme-certificate",
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
    id: "debt_profile",
    label: "Debt Profile",
    description: "Debt profile spreadsheet",
    storagePrefix: "debt-profile",
  },
  {
    id: "mis",
    label: "MIS",
    description: "Management Information System report",
    storagePrefix: "mis",
  },
  {
    id: "additional",
    label: "Additional Documents",
    description: "Any supporting documents",
    storagePrefix: "additional-documents",
  },
];