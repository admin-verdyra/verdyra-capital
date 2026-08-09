"use client";

import Link from "next/link";
import EmiCalculator from "@/components/sections/EmiCalculator";
import Card from "@/components/ui/Card";

export default function EmiCalculatorPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/portal/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">EMI Calculator</h1>
          <p className="mt-2 text-slate-500">
            Estimate your monthly repayment and understand your funding cost.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <Card className="rounded-2xl border-slate-200">
        <EmiCalculator />
      </Card>
    </div>
  );
}