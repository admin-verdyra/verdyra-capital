"use client";

import React, { useEffect, useMemo, useState } from "react";

const LOAN_MIN = 10_000;
const LOAN_MAX = 250_000_000; // 25 Crore

const formatIndian = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

type TenureUnit = "months" | "years";

type ScheduleRow = {
  month: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
};

const scheduleDisclaimer =
  "Disclaimer: This is a tentative repayment schedule prepared based on the loan amount, interest rate and tenure selected by you. Actual repayment schedule may vary depending on lender approval, applicable charges, taxes, disbursement date and final loan terms.";

const getAmountFontSize = (value: string) =>
  `clamp(0.82rem, calc(100cqw / ${Math.max(value.length * 0.48, 9)}), 1.5rem)`;

function SummaryCard({ label, value }: { label: string; value: number }) {
  const formattedValue = formatCurrency(value);

  return (
    <div className="flex h-full min-w-0 items-center justify-center rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 sm:p-4">
      <div
        className="w-full min-w-0 text-center"
        style={{ containerType: "inline-size" }}
      >
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p
          className="mt-1 max-w-full whitespace-nowrap font-semibold leading-tight tracking-tight text-[#111111] tabular-nums"
          style={{ fontSize: getAmountFontSize(formattedValue) }}
        >
          {formattedValue}
        </p>
      </div>
    </div>
  );
}

const formatPdfCurrency = (value: number) => `Rs. ${formatIndian(value)}`;

const sanitizePdfText = (value: string) =>
  value
    .replace(/₹/g, "Rs. ")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, "");

const escapePdfText = (value: string) =>
  sanitizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const makeTextCommand = (
  x: number,
  y: number,
  size: number,
  text: string,
  options: {
    font?: "regular" | "bold";
    color?: [number, number, number];
  } = {},
) => {
  const font = options.font === "bold" ? "F2" : "F1";
  const [r, g, b] = options.color ?? [0.07, 0.07, 0.07];
  return `${r} ${g} ${b} rg BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`;
};

const makeRectCommand = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number],
) => `${color[0]} ${color[1]} ${color[2]} rg ${x} ${y} ${width} ${height} re f`;

const makeLineCommand = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: [number, number, number],
) => `${color[0]} ${color[1]} ${color[2]} RG 0.6 w ${x1} ${y1} m ${x2} ${y2} l S`;

const wrapPdfText = (text: string, maxLength: number) => {
  const words = sanitizePdfText(text).split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
      return;
    }
    current = next;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
};

const createPdfBlob = (pageContents: string[]) => {
  const encoder = new TextEncoder();
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pageContents.forEach((content, index) => {
    const pageObjectId = 5 + index * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(
      `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`,
    );
  });

  objects[1] =
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const buildEmiSchedulePdf = ({
  loanAmount,
  interestRate,
  tenureLabel,
  results,
  amortizationSchedule,
}: {
  loanAmount: number;
  interestRate: number;
  tenureLabel: string;
  results: { emi: number; totalInterest: number; totalRepayment: number };
  amortizationSchedule: ScheduleRow[];
}) => {
  const pages: string[] = [];
  const columnX = [42, 92, 190, 272, 354, 436];
  const columns = ["Month", "Opening Balance", "EMI", "Principal", "Interest", "Closing Balance"];
  const firstPageRows = 18;
  const continuationPageRows = 30;

  const addPageHeader = (commands: string[], title: string, pageNumber: number) => {
    commands.push(makeRectCommand(0, 788, 595, 54, [0.06, 0.35, 0.23]));
    commands.push(makeTextCommand(42, 812, 18, "Verdyra Capital", { font: "bold", color: [1, 1, 1] }));
    commands.push(makeTextCommand(42, 796, 9, "Professional EMI Repayment Schedule", { color: [0.95, 0.84, 0.56] }));
    commands.push(makeTextCommand(470, 812, 9, title, { color: [1, 1, 1] }));
    commands.push(makeTextCommand(510, 26, 8, `Page ${pageNumber}`, { color: [0.45, 0.49, 0.55] }));
  };

  let startIndex = 0;
  while (startIndex < amortizationSchedule.length) {
    const pageNumber = pages.length + 1;
    const commands: string[] = [];
    const rowsOnPage = startIndex === 0 ? firstPageRows : continuationPageRows;
    const pageRows = amortizationSchedule.slice(startIndex, startIndex + rowsOnPage);
    addPageHeader(commands, "EMI Schedule", pageNumber);

    let y = 760;
    if (startIndex === 0) {
      commands.push(makeTextCommand(42, y, 15, "Loan Summary", { font: "bold" }));
      y -= 24;
      const summaryItems = [
        ["Loan Amount", formatPdfCurrency(loanAmount)],
        ["Interest Rate", `${interestRate.toFixed(2)}% p.a.`],
        ["Tenure", tenureLabel],
        ["Monthly EMI", formatPdfCurrency(results.emi)],
        ["Principal Amount", formatPdfCurrency(loanAmount)],
        ["Total Interest", formatPdfCurrency(results.totalInterest)],
        ["Total Repayment", formatPdfCurrency(results.totalRepayment)],
      ];

      summaryItems.forEach(([label, value], index) => {
        const x = index % 2 === 0 ? 42 : 312;
        const itemY = y - Math.floor(index / 2) * 42;
        commands.push(makeRectCommand(x, itemY - 18, 230, 32, [0.97, 0.98, 0.97]));
        commands.push(makeTextCommand(x + 12, itemY + 2, 8, label, { color: [0.39, 0.45, 0.52] }));
        commands.push(makeTextCommand(x + 12, itemY - 11, 10, value, { font: "bold" }));
      });
      y -= 190;
    }

    commands.push(makeTextCommand(42, y, 13, startIndex === 0 ? "Month-wise Repayment Schedule" : "Repayment Schedule Continued", { font: "bold" }));
    y -= 24;
    commands.push(makeRectCommand(36, y - 8, 526, 22, [0.94, 0.97, 0.95]));
    columns.forEach((column, index) => {
      commands.push(makeTextCommand(columnX[index], y, 7.5, column, { font: "bold", color: [0.06, 0.35, 0.23] }));
    });
    y -= 20;

    pageRows.forEach((row, index) => {
      if (index % 2 === 0) {
        commands.push(makeRectCommand(36, y - 7, 526, 18, [0.99, 0.99, 0.98]));
      }
      const values = [
        String(row.month),
        formatPdfCurrency(row.openingBalance),
        formatPdfCurrency(row.emi),
        formatPdfCurrency(row.principal),
        formatPdfCurrency(row.interest),
        formatPdfCurrency(row.closingBalance),
      ];
      values.forEach((value, valueIndex) => {
        commands.push(makeTextCommand(columnX[valueIndex], y, 7, value, { color: [0.2, 0.24, 0.28] }));
      });
      commands.push(makeLineCommand(36, y - 10, 562, y - 10, [0.9, 0.92, 0.9]));
      y -= 18;
    });

    if (startIndex + rowsOnPage >= amortizationSchedule.length) {
      y -= 8;
      commands.push(makeTextCommand(42, Math.max(y, 62), 9, "Disclaimer", { font: "bold", color: [0.06, 0.35, 0.23] }));
      wrapPdfText(scheduleDisclaimer.replace("Disclaimer: ", ""), 112).forEach((line, index) => {
        commands.push(makeTextCommand(42, Math.max(y - 14 - index * 11, 38), 7.5, line, { color: [0.39, 0.45, 0.52] }));
      });
    }

    pages.push(commands.join("\n"));
    startIndex += rowsOnPage;
  }

  return createPdfBlob(pages);
};

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(15_000_000);
  const [loanInputRaw, setLoanInputRaw] = useState<string | null>(null);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [interestInputRaw, setInterestInputRaw] = useState<string | null>(null);
  const [tenureValue, setTenureValue] = useState<number>(60);
  const [tenureInputRaw, setTenureInputRaw] = useState<string | null>(null);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("months");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const tenureMonths = useMemo(
    () =>
      tenureUnit === "years"
        ? Math.round(tenureValue * 12)
        : Math.round(tenureValue),
    [tenureUnit, tenureValue],
  );

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const getLoanStep = (value: number) => {
    if (value < 1_000_000) return 10_000;
    if (value < 10_000_000) return 50_000;
    if (value < 50_000_000) return 100_000;
    return 500_000;
  };

  const loanStep = getLoanStep(loanAmount);

  const results = useMemo(() => {
    const principal = clamp(Math.round(loanAmount), LOAN_MIN, LOAN_MAX);
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = Math.max(1, Math.round(tenureMonths));

    if (monthlyRate === 0) {
      const emi = principal / totalMonths;
      return { emi, totalInterest: 0, totalRepayment: principal };
    }

    const ratePow = Math.pow(1 + monthlyRate, totalMonths);
    const emi = (principal * monthlyRate * ratePow) / (ratePow - 1);
    const totalRepayment = emi * totalMonths;
    const totalInterest = totalRepayment - principal;
    return { emi, totalInterest, totalRepayment };
  }, [loanAmount, interestRate, tenureMonths]);

  const amortizationSchedule = useMemo(() => {
    const principal = clamp(Math.round(loanAmount), LOAN_MIN, LOAN_MAX);
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = Math.max(1, Math.round(tenureMonths));
    const emi = results.emi;
    const rows: ScheduleRow[] = [];

    let balance = principal;
    for (let month = 1; month <= totalMonths; month += 1) {
      const interestPayment = Math.round(balance * monthlyRate);
      let principalPayment = Math.round(emi - interestPayment);
      let emiPayment = Math.round(emi);
      if (month === totalMonths) {
        principalPayment = balance;
        emiPayment = balance + interestPayment;
      }
      const closingBalance = Math.max(0, balance - principalPayment);
      rows.push({
        month,
        openingBalance: balance,
        emi: emiPayment,
        principal: principalPayment,
        interest: interestPayment,
        closingBalance,
      });
      balance = closingBalance;
    }

    return rows;
  }, [loanAmount, interestRate, tenureMonths, results.emi]);

  const handleOpenSchedule = () => setIsScheduleOpen(true);
  const handleCloseSchedule = () => setIsScheduleOpen(false);
  const tenureLabel =
    tenureUnit === "years" ? `${tenureValue} Years` : `${tenureValue} Months`;

  const handleDownloadPdf = () => {
    const pdf = buildEmiSchedulePdf({
      loanAmount,
      interestRate,
      tenureLabel,
      results,
      amortizationSchedule,
    });
    const url = URL.createObjectURL(pdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = "verdyra-capital-emi-schedule.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsScheduleOpen(false);
      }
    };
    if (isScheduleOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
    return undefined;
  }, [isScheduleOpen]);

  // Handlers for loan input (temporary raw text, commit on blur/Enter)
  const handleLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    setLoanInputRaw(digits);
  };

  const commitLoanInput = (fromRaw?: string | null) => {
    const raw = fromRaw ?? loanInputRaw;
    const digits = (raw ?? "").replace(/[^0-9]/g, "");
    const parsed = digits ? Number(digits) : 0;
    const clamped = clamp(parsed || 0, LOAN_MIN, LOAN_MAX);
    setLoanAmount(clamped);
    setLoanInputRaw(null);
  };

  const handleLoanBlur = () => commitLoanInput();
  const handleLoanKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitLoanInput();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleInterestFocus = () => setInterestInputRaw(String(interestRate));
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestInputRaw(e.target.value);
  };

  const commitInterestInput = (fromRaw?: string | null) => {
    const raw = fromRaw ?? interestInputRaw;
    if (raw === null) return;
    const numeric = Number(raw.trim());
    if (Number.isNaN(numeric)) {
      setInterestInputRaw(null);
      return;
    }

    setInterestRate(clamp(Math.round(numeric * 100) / 100, 5, 50));
    setInterestInputRaw(null);
  };

  const handleInterestBlur = () => commitInterestInput();
  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitInterestInput();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleTenureFocus = () => setTenureInputRaw(String(tenureValue));
  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    setTenureInputRaw(digits);
  };

  const commitTenureInput = (fromRaw?: string | null) => {
    const raw = fromRaw ?? tenureInputRaw;
    const digits = (raw ?? "").replace(/[^0-9]/g, "");
    const parsed = digits ? Number(digits) : NaN;
    if (Number.isNaN(parsed)) {
      setTenureInputRaw(null);
      return;
    }

    const min = tenureUnit === "years" ? 1 : 1;
    const max = tenureUnit === "years" ? 30 : 360;
    const clamped = clamp(Math.round(parsed), min, max);
    setTenureValue(clamped);
    setTenureInputRaw(null);
  };

  const handleTenureBlur = () => commitTenureInput();
  const handleTenureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitTenureInput();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleTenureUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as TenureUnit;
    const currentRaw = tenureInputRaw !== null ? Number(tenureInputRaw) : tenureValue;
    const validCurrent = !Number.isNaN(currentRaw);
    const nextValue = validCurrent
      ? next === "years"
        ? Math.max(1, Math.round(currentRaw / 12))
        : Math.max(1, Math.round(currentRaw * 12))
      : tenureValue;
    setTenureUnit(next);
    setTenureValue(nextValue);
    setTenureInputRaw(tenureInputRaw !== null ? String(nextValue) : null);
  };

  // small EMI animation state
  const [animateEmi, setAnimateEmi] = useState(false);
  useEffect(() => {
    const start = setTimeout(() => setAnimateEmi(true), 0);
    const end = setTimeout(() => setAnimateEmi(false), 260);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [results.emi]);

  return (
    <section id="calculator" className="bg-white px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-[#F8FAF9] p-8 shadow-[0_20px_60px_rgba(17,17,17,0.05)] sm:p-10 lg:p-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5A3A]">
            EMI Calculator
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Plan your repayment with clarity.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Estimate your monthly EMI and understand the total cost of funding
            before you apply.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Loan Amount
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <input
                        inputMode="numeric"
                        value={
                          loanInputRaw !== null
                            ? loanInputRaw
                            : formatIndian(loanAmount)
                        }
                        onChange={handleLoanChange}
                        onFocus={() => setLoanInputRaw(String(loanAmount))}
                        onBlur={handleLoanBlur}
                        onKeyDown={handleLoanKeyDown}
                        className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] max-w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-3 h-10 text-sm text-right outline-none shadow-sm transition-shadow duration-150 ease-in-out focus:shadow-md focus:ring-2 focus:ring-[#0F5A3A]/20 tabular-nums"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Choose the amount you wish to borrow.
                </p>
                <input
                  type="range"
                  min={LOAN_MIN}
                  max={LOAN_MAX}
                  step={loanStep}
                  value={loanAmount}
                  onChange={(e) => {
                    setLoanAmount(Number(e.target.value));
                    setLoanInputRaw(null);
                  }}
                  className="range h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 mt-3"
                  aria-label="Loan amount"
                />
              </div>

              <div>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Interest Rate
                  </span>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      inputMode="decimal"
                      step={0.05}
                      min={5}
                      max={50}
                      value={interestInputRaw !== null ? interestInputRaw : interestRate.toFixed(2)}
                      onFocus={handleInterestFocus}
                      onChange={handleInterestChange}
                      onBlur={handleInterestBlur}
                      onKeyDown={handleInterestKeyDown}
                      className="w-[100px] rounded-2xl border border-slate-200 bg-[#F8FAF9] px-3 h-10 text-sm text-right outline-none shadow-sm transition-shadow duration-150 ease-in-out focus:shadow-md focus:ring-2 focus:ring-[#B8860B]/20 tabular-nums"
                    />
                    <span className="text-[#B8860B] tabular-nums">
                      {interestRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Annual interest rate.
                </p>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => {
                    setInterestRate(Number(e.target.value));
                    setInterestInputRaw(null);
                  }}
                  className="range h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 mt-3"
                  aria-label="Interest rate"
                />
              </div>

              <div>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Tenure
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={tenureInputRaw !== null ? tenureInputRaw : String(tenureValue)}
                      onFocus={handleTenureFocus}
                      onChange={handleTenureChange}
                      onBlur={handleTenureBlur}
                      onKeyDown={handleTenureKeyDown}
                      className="w-[80px] rounded-2xl border border-slate-200 bg-[#F8FAF9] px-3 h-10 text-sm text-right outline-none shadow-sm transition-shadow duration-150 ease-in-out focus:shadow-md focus:ring-2 focus:ring-[#0F5A3A]/20 tabular-nums"
                    />
                    <select
                      value={tenureUnit}
                      onChange={handleTenureUnitChange}
                      className="rounded-2xl border border-slate-200 bg-[#F8FAF9] px-3 h-10 text-sm outline-none shadow-sm"
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Select repayment duration.
                </p>
                <input
                  type="range"
                  min={tenureUnit === "years" ? 1 : 1}
                  max={tenureUnit === "years" ? 30 : 360}
                  step={1}
                  value={tenureValue}
                  onChange={(e) => {
                    setTenureValue(Number(e.target.value));
                    setTenureInputRaw(null);
                  }}
                  className="range h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 mt-3"
                  aria-label="Tenure"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md">
            <div className="rounded-[20px] border border-[#0F5A3A]/10 bg-[#F8FAF9] p-10 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5A3A]">
                Monthly EMI
              </p>
              <p
                className={`mt-3 text-5xl font-semibold tracking-tight text-[#111111] transition-transform duration-200 ${animateEmi ? "scale-105" : "scale-100"}`}
              >
                {formatCurrency(results.emi)}
              </p>
            </div>

            <div
              className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_1.16fr]"
              style={{ gridAutoRows: "1fr" }}
            >
              <SummaryCard label="Principal Amount" value={loanAmount} />
              <SummaryCard
                label="Total Interest"
                value={results.totalInterest}
              />
              <SummaryCard
                label="Total Repayment"
                value={results.totalRepayment}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#111111]">
                See Your Best Loan Offers
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Compare offers from leading banks and NBFCs in under 2 minutes.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="#eligibility"
                  className="inline-flex items-center rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
                >
                  Check Eligibility
                </a>
                <button
                  type="button"
                  onClick={handleOpenSchedule}
                  className="group inline-flex cursor-pointer items-center rounded-full border border-[#0F5A3A]/15 bg-white px-6 py-3 text-sm font-semibold text-[#0F5A3A] transition duration-300 hover:-translate-y-0.5 hover:border-[#0F5A3A] hover:bg-[#F3F7F4] hover:text-[#0a472f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  View EMI Schedule
                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isScheduleOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm sm:py-8"
          onClick={handleCloseSchedule}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="emi-schedule-title"
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
              <div>
                <p
                  id="emi-schedule-title"
                  className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F5A3A]"
                >
                  Detailed EMI Repayment Schedule
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See how every EMI is split into Principal and Interest over
                  the tenure.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="hidden cursor-pointer items-center justify-center rounded-full bg-[#0F5A3A] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:inline-flex"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleCloseSchedule}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A3A]/30"
                  aria-label="Close EMI schedule modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Loan Amount
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Interest Rate
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {interestRate.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Tenure
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {tenureLabel}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Monthly EMI
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {formatCurrency(results.emi)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Principal Amount
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Total Interest
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {formatCurrency(results.totalInterest)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-[#F8FAF9] p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Total Repayment
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#111111]">
                    {formatCurrency(results.totalRepayment)}
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[780px] w-full border-collapse text-left text-sm text-slate-700">
                    <thead className="sticky top-0 z-10 bg-[#F3F7F4] text-xs font-semibold uppercase tracking-[0.16em] text-[#0F5A3A] shadow-sm">
                      <tr>
                        <th className="px-4 py-4">Month</th>
                        <th className="px-4 py-4">Opening Balance</th>
                        <th className="px-4 py-4">EMI</th>
                        <th className="px-4 py-4">Principal</th>
                        <th className="px-4 py-4">Interest</th>
                        <th className="px-4 py-4">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row) => (
                        <tr
                          key={row.month}
                          className="border-t border-slate-100 odd:bg-white even:bg-[#F8FAF9]"
                        >
                          <td className="px-4 py-3 font-medium text-[#111111]">
                            {row.month}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                            {formatCurrency(row.openingBalance)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                            {formatCurrency(row.emi)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                            {formatCurrency(row.closingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-20 flex flex-col gap-4 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-slate-500">
                {scheduleDisclaimer}
              </p>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F5A3A] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A3A]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .range::-webkit-slider-runnable-track {
          height: 8px;
          background: #e6eef0;
          border-radius: 999px;
        }
        .range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: white;
          border: 2px solid #0f5a3a;
          box-shadow: 0 4px 10px rgba(15, 90, 58, 0.18);
          margin-top: -7px;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }
        .range:hover::-webkit-slider-thumb {
          transform: scale(1.06);
          box-shadow: 0 6px 14px rgba(15, 90, 58, 0.22);
        }
        .range:focus-visible::-webkit-slider-thumb {
          transform: scale(1.08);
          box-shadow: 0 8px 18px rgba(15, 90, 58, 0.26);
        }
        .range::-moz-range-track {
          height: 8px;
          background: #e6eef0;
          border-radius: 999px;
        }
        .range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: white;
          border: 2px solid #0f5a3a;
          box-shadow: 0 4px 10px rgba(15, 90, 58, 0.18);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }
        .range:hover::-moz-range-thumb {
          transform: scale(1.06);
          box-shadow: 0 6px 14px rgba(15, 90, 58, 0.22);
        }
        .range:focus-visible::-moz-range-thumb {
          transform: scale(1.08);
          box-shadow: 0 8px 18px rgba(15, 90, 58, 0.26);
        }
      `}</style>
    </section>
  );
}
