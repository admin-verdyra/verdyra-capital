"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import DashboardView from "./DashboardView";
import DocumentsView from "./DocumentsView";
import Sidebar from "./Sidebar";

type Customer = {
  username: string;
  password: string;
  full_name: string;
  email: string;
};

type DocumentDefinition = {
  id: string;
  label: string;
  storagePrefix: string;
};

type UploadedDocument = {
  fileName: string;
  uploadedAt: string;
};

const documents: DocumentDefinition[] = [
  { id: "aadhaar", label: "Aadhaar Card", storagePrefix: "aadhaar-card" },
  { id: "pan", label: "PAN Card", storagePrefix: "pan-card" },
  { id: "gst", label: "GST Certificate", storagePrefix: "gst-certificate" },
  { id: "bank", label: "Bank Statements", storagePrefix: "bank-statements" },
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

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");

const formatUploadDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function CustomerPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "documents">(
    "dashboard",
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [documentsById, setDocumentsById] = useState<
    Record<string, UploadedDocument>
  >({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState("");

  const customerFolder = customer?.username.trim();

  const profileRows = useMemo(
    () =>
      customer
        ? [
            { label: "Name", value: customer.full_name },
            { label: "Username", value: customer.username },
            { label: "Email", value: customer.email },
          ]
        : [],
    [customer],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!customerFolder) {
      setDocumentsById({});
      return;
    }

    const loadDocuments = async () => {
      setDocumentError("");
      const { data, error } = await supabase.storage
        .from("customer-documents")
        .list(customerFolder, {
          limit: 100,
          sortBy: { column: "updated_at", order: "desc" },
        });

      if (error) {
        setDocumentError("We could not load your uploaded documents.");
        return;
      }

      const nextDocuments: Record<string, UploadedDocument> = {};
      documents.forEach((document) => {
        const file = data?.find((item) =>
          item.name.startsWith(`${document.storagePrefix}-`),
        );
        if (!file) {
          return;
        }

        nextDocuments[document.id] = {
          fileName: file.name.replace(`${document.storagePrefix}-`, ""),
          uploadedAt: file.updated_at ?? file.created_at ?? new Date().toISOString(),
        };
      });

      setDocumentsById(nextDocuments);
    };

    void loadDocuments();
  }, [customerFolder]);

  const resetLoginForm = () => {
    setUsername("");
    setPassword("");
    setCaptchaChecked(false);
    setLoginError("");
  };

  const handleLogin = async () => {
    setLoginError("");

    if (!username.trim() || !password) {
      setLoginError("Please enter your username and password.");
      return;
    }

    if (!captchaChecked) {
      setLoginError("Please confirm that you are not a robot.");
      return;
    }

    setIsLoggingIn(true);

    const { data, error } = await supabase
      .from("customers")
      .select("username,password,full_name,email")
      .eq("username", username.trim())
      .eq("password", password)
      .maybeSingle<Customer>();

    setIsLoggingIn(false);

    if (error || !data) {
      setLoginError("Invalid username or password.");
      return;
    }

    setCustomer(data);
    setActiveView("dashboard");
    resetLoginForm();
  };

  const handleLogout = () => {
    setCustomer(null);
    setDocumentsById({});
    setDocumentError("");
    setIsOpen(false);
  };

  const handleUpload = async (
    document: DocumentDefinition,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !customerFolder) {
      return;
    }

    setDocumentError("");
    setUploadingId(document.id);

    const fileName = `${document.storagePrefix}-${sanitizeFileName(file.name)}`;
    const filePath = `${customerFolder}/${fileName}`;
    const { error } = await supabase.storage
      .from("customer-documents")
      .upload(filePath, file, {
        upsert: true,
      });

    setUploadingId(null);

    if (error) {
      setDocumentError("Upload failed. Please try again.");
      return;
    }

    setDocumentsById((current) => ({
      ...current,
      [document.id]: {
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-[#0F6B47] bg-white px-6 py-3 text-[15px] font-semibold text-[#0F6B47] transition hover:bg-[#0F6B47] hover:text-white"
      >
        Customer Portal
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-portal-title"
            className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-200"
            onClick={(event) => event.stopPropagation()}
          >
            {customer ? (
              <div className="grid h-[90vh] lg:grid-cols-[260px_1fr]">
                <Sidebar
  customer={customer}
  activeView={activeView}
  onChangeView={setActiveView}
  onLogout={handleLogout}
/>

                <div className="h-full overflow-y-auto p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F5A3A]">
                        {activeView === "dashboard"
                          ? "Dashboard"
                          : "Documents"}
                      </p>
                      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
                        {activeView === "dashboard"
                          ? "Account Overview"
                          : "Upload Documents"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Close customer portal"
                    >
                      ×
                    </button>
                  </div>

                  {activeView === "dashboard" ? (
  <div className="mt-8">
    <DashboardView customer={customer!} />
  </div>
) : (
  <div className="mt-8">
    <DocumentsView
      documents={documents}
      documentsById={documentsById}
      uploadingId={uploadingId}
      onUpload={(document, file) => {
        const input = {
          target: {
            files: [file],
            value: "",
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        void handleUpload(document, input);
      }}
    />
  </div>
)}
                </div>
              </div>
            ) : (
              <div className="relative mx-auto max-w-xl p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close login modal"
                >
                  ×
                </button>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F5A3A]">
                  Verdyra Capital
                </p>
                <h2
                  id="customer-portal-title"
                  className="mt-3 text-3xl font-semibold tracking-tight text-[#111111]"
                >
                  Customer Portal
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in to view your profile and upload loan documents
                  securely.
                </p>

                <div className="mt-7 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
                      autoComplete="current-password"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={captchaChecked}
                      onChange={(event) =>
                        setCaptchaChecked(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#0F5A3A] focus:ring-[#0F5A3A]"
                    />
                    I&apos;m not a robot
                  </label>

                  {loginError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {loginError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => void handleLogin()}
                    disabled={isLoggingIn}
                    className="w-full rounded-full bg-[#0F5A3A] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoggingIn ? "Signing in..." : "Login"}
                  </button>

                  <a
                    href="mailto:connect@verdyracapital.in?subject=Customer%20Portal%20Password%20Reset"
                    className="block text-center text-sm font-semibold text-[#0F5A3A] transition hover:text-[#B8860B]"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
