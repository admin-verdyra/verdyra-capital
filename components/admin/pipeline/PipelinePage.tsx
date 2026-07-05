"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  FileText,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";

import { getAllCustomers } from "@/lib/admin/customerService";
import PipelineBoard from "./PipelineBoard";

type Customer = {
  username: string;
  full_name: string;
  product: string | null;
  loan_amount: number | null;
  application_status: string | null;
};

export default function PipelinePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const term = search.toLowerCase();

      return (
        customer.full_name.toLowerCase().includes(term) ||
        customer.username.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  const stats = {
    total: customers.length,
    documents: customers.filter(
      (c) => c.application_status === "Documents Pending"
    ).length,
    approved: customers.filter(
      (c) => c.application_status === "Approved"
    ).length,
    disbursed: customers.filter(
      (c) => c.application_status === "Disbursed"
    ).length,
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-20 text-center">
        Loading pipeline...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Pipeline
          </h1>

          <p className="mt-2 text-slate-500">
            Track every customer through the lending lifecycle.
          </p>

        </div>

        <div className="relative w-[340px]">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-[#0F5A3A]"
          />

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Documents Pending"
          value={stats.documents}
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<BadgeCheck size={22} />}
        />

        <StatCard
          title="Disbursed"
          value={stats.disbursed}
          icon={<IndianRupee size={22} />}
        />

      </div>

      <PipelineBoard
        customers={filteredCustomers}
      />

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F7F4] text-[#0F5A3A]">
          {icon}
        </div>

      </div>

    </div>
  );
}