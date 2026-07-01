'use client';

import { useMemo, useState } from 'react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(15000000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(60);

  const results = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = tenure;

    if (monthlyRate === 0) {
      return {
        emi: principal / totalMonths,
        totalInterest: 0,
        totalRepayment: principal,
      };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalRepayment = emi * totalMonths;
    const totalInterest = totalRepayment - principal;

    return {
      emi,
      totalInterest,
      totalRepayment,
    };
  }, [loanAmount, interestRate, tenure]);

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
            Estimate your monthly EMI and understand the total cost of funding before you apply.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-7">
              <div>
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>Loan Amount</span>
                  <span className="text-[#0F5A3A]">{formatCurrency(loanAmount)}</span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0F5A3A]"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>Interest Rate</span>
                  <span className="text-[#B8860B]">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="0.5"
                  value={interestRate}
                  onChange={(event) => setInterestRate(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#B8860B]"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>Tenure</span>
                  <span className="text-[#0F5A3A]">{tenure} months</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="1"
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0F5A3A]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-[20px] border border-[#0F5A3A]/10 bg-[#F8FAF9] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5A3A]">
                Monthly EMI
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-[#111111]">
                {formatCurrency(results.emi)}
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-500">Total Interest</p>
                <p className="mt-2 text-2xl font-semibold text-[#111111]">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-500">Total Repayment</p>
                <p className="mt-2 text-2xl font-semibold text-[#111111]">
                  {formatCurrency(results.totalRepayment)}
                </p>
              </div>
            </div>

            <a
              href="#eligibility"
              className="mt-6 inline-flex items-center rounded-full bg-[#0F5A3A] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a472f]"
            >
              Need Better Rates? Check Your Eligibility
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
