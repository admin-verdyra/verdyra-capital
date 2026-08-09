"use client";

import { useEffect, useState } from "react";
import { usePortal } from "@/components/portal/PortalProvider";
import { getCustomerDocuments, type CustomerDocument } from "@/lib/documents/documentService";
import {
  FileText,
  Upload,
} from "lucide-react";

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today • ${timeString}`;
  }
  if (isYesterday) {
    return `Yesterday • ${timeString}`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDocumentIcon(documentType: string) {
  const type = documentType.toLowerCase();
  if (type.includes("pan") || type.includes("aadhaar") || type.includes("id")) {
    return Upload;
  }
  return FileText;
}

function getDocumentColor(documentType: string) {
  const type = documentType.toLowerCase();
  if (type.includes("pan")) {
    return "bg-emerald-50 text-emerald-600";
  }
  if (type.includes("gst")) {
    return "bg-blue-50 text-blue-600";
  }
  if (type.includes("aadhaar")) {
    return "bg-amber-50 text-amber-600";
  }
  if (type.includes("bank")) {
    return "bg-sky-50 text-sky-600";
  }
  if (type.includes("financial") || type.includes("msme")) {
    return "bg-purple-50 text-purple-600";
  }
  return "bg-slate-50 text-slate-600";
}

export default function RecentActivity() {
  const { customer } = usePortal();
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customer?.username) {
      setLoading(false);
      return;
    }

    const username = customer.username;

    async function fetchDocuments() {
      try {
        setLoading(true);
        setError(null);
        const docs = await getCustomerDocuments(username);
        setDocuments(docs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Unable to load recent activity.");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [customer?.username]);

  if (loading) {
    return (
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
          Updates
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Recent Activity
        </h2>

        <div className="mt-8 text-center py-8">
          <p className="text-slate-500">Loading recent activity...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
          Updates
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Recent Activity
        </h2>

        <div className="mt-8 text-center py-8">
          <p className="text-slate-500">{error}</p>
        </div>
      </section>
    );
  }

  const recentDocuments = documents.slice(0, 5);

  if (recentDocuments.length === 0) {
    return (
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
          Updates
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Recent Activity
        </h2>

        <div className="mt-8 text-center py-8">
          <p className="text-slate-500">No recent activity yet.</p>
          <p className="mt-1 text-sm text-slate-400">
            Updates to your application will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
        Updates
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-8 space-y-6">

        {recentDocuments.map((doc) => {
          const Icon = getDocumentIcon(doc.document_type);
          const color = getDocumentColor(doc.document_type);
          const displayName = doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1);

          return (
            <div
              key={doc.id}
              className="flex items-start gap-4"
            >

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {displayName} Uploaded
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatTimestamp(doc.uploaded_at)}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}