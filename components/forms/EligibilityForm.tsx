'use client';

import { useMemo, useState } from 'react';

type LoanType = 'business' | 'personal';

const businessCategories = [
  'D2C Brand',
  'Marketplace Seller',
  'Manufacturer',
  'Distributor',
  'Retail',
  'Restaurant',
  'Healthcare',
  'Logistics',
  'SaaS',
  'Services',
  'Other',
];

const turnoverOptions = ['₹25L - ₹1Cr', '₹1Cr - ₹5Cr', '₹5Cr - ₹20Cr', '₹20Cr+'];
const vintageOptions = ['0 - 1 year', '1 - 3 years', '3 - 5 years', '5+ years'];

export default function EligibilityForm() {
  const [loanType, setLoanType] = useState<LoanType>('business');
  const [businessCategory, setBusinessCategory] = useState(businessCategories[0]);
  const [monthlyTurnover, setMonthlyTurnover] = useState(turnoverOptions[1]);
  const [businessVintage, setBusinessVintage] = useState(vintageOptions[1]);
  const [city, setCity] = useState('Mumbai');
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const indicativeFunding = useMemo(() => {
    if (loanType === 'business') {
      const turnoverValue = monthlyTurnover.includes('₹25L')
        ? 2500000
        : monthlyTurnover.includes('₹1Cr - ₹5Cr')
          ? 30000000
          : monthlyTurnover.includes('₹5Cr - ₹20Cr')
            ? 125000000
            : 250000000;
      return turnoverValue * 3;
    }

    const incomeValue = 1200000;
    return incomeValue * 2;
  }, [loanType, monthlyTurnover]);

  const fundingLabel = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(indicativeFunding);

  const validateForm = () => {
    const trimmedName = businessName.trim();
    const trimmedContact = contactPerson.trim();
    const trimmedMobile = mobileNumber.trim();
    const trimmedEmail = emailAddress.trim();

    if (!trimmedName || !trimmedContact) {
      return 'Please provide your business name and contact person.';
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(trimmedMobile)) {
      return 'Please enter a valid mobile number.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (!agreed) {
      return 'Please agree to the terms and privacy policy.';
    }

    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatus('error');
      setMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('idle');
      setMessage('');

      const response = await fetch('https://formsubmit.co/ajax/connect@verdyracapital.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'New Verdyra Capital Eligibility Enquiry',
          _captcha: 'false',
          loanType,
          businessCategory,
          monthlyTurnover,
          businessVintage,
          city,
          businessName: businessName.trim(),
          contactPerson: contactPerson.trim(),
          mobileNumber: mobileNumber.trim(),
          emailAddress: emailAddress.trim(),
          indicativeFunding: fundingLabel,
          agreed,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setStatus('success');
      setMessage('Thank you. Our advisory team will contact you shortly.');
    } catch (error) {
      setStatus('error');
      setMessage('We could not submit your enquiry right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="eligibility" onSubmit={handleSubmit} className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-[0_24px_80px_rgba(15,90,58,0.12)] sm:p-8">
      <div className="flex rounded-full bg-[#F3F7F4] p-1.5">
        <button
          type="button"
          onClick={() => setLoanType('business')}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            loanType === 'business'
              ? 'bg-[#0F5A3A] text-white shadow-sm'
              : 'text-[#0F5A3A]/80 hover:text-[#0F5A3A]'
          }`}
        >
          Business Loan
        </button>
        <button
          type="button"
          onClick={() => setLoanType('personal')}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            loanType === 'personal'
              ? 'bg-[#0F5A3A] text-white shadow-sm'
              : 'text-[#0F5A3A]/80 hover:text-[#0F5A3A]'
          }`}
        >
          Personal Loan
        </button>
      </div>

      {loanType === 'business' ? (
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business Category
            </label>
            <select
              value={businessCategory}
              onChange={(event) => setBusinessCategory(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            >
              {businessCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monthly Turnover
            </label>
            <select
              value={monthlyTurnover}
              onChange={(event) => setMonthlyTurnover(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            >
              {turnoverOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business Vintage
            </label>
            <select
              value={businessVintage}
              onChange={(event) => setBusinessVintage(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            >
              {vintageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter your city"
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monthly Income
            </label>
            <select className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]">
              <option>₹60,000 - ₹1L</option>
              <option>₹1L - ₹2L</option>
              <option>₹2L+</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employment Type
            </label>
            <select className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]">
              <option>Salaried</option>
              <option>Self-employed</option>
              <option>Freelancer</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter your city"
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            />
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[24px] border border-[#0F5A3A]/10 bg-[#F8FAF9] p-5">
        <p className="text-sm font-medium text-[#0F5A3A]">Indicative Funding</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-[#111111] sm:text-6xl">
          {fundingLabel}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-full border border-[#0F5A3A]/10 bg-white px-3 py-2 text-sm text-slate-700">
            Interest Rate: Starting from 8%
          </div>
          <div className="rounded-full border border-[#0F5A3A]/10 bg-white px-3 py-2 text-sm text-slate-700">
            Expected Decision: Within 2 Business Days
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Indicative estimate only. Final eligibility is subject to lender assessment.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Business Name
          </label>
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Enter your business name"
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Contact Person
          </label>
          <input
            value={contactPerson}
            onChange={(event) => setContactPerson(event.target.value)}
            placeholder="Your full name"
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mobile Number
            </label>
            <input
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              placeholder="98765 43210"
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-[#0F5A3A]"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#F8FAF9] px-4 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0F5A3A] focus:ring-[#0F5A3A]"
          />
          <span>
            I agree to the{' '}
            <a href="/terms-and-conditions" className="font-medium text-[#0F6B47] transition-colors hover:text-[#C89B3C] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="font-medium text-[#0F6B47] transition-colors hover:text-[#C89B3C] hover:underline">
              Privacy Policy
            </a>
            , and consent to being contacted by Verdyra Capital and its lending partners regarding my financing enquiry.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#B8860B] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9f6f08] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting…' : 'Submit Enquiry'}
        </button>

        {message ? (
          <div
            aria-live="polite"
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}
