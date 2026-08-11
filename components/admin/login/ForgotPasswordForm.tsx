"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSuccessMessage(data?.message ?? "If an account exists for this email address, you will receive a password reset link shortly.");
      setSubmitted(true);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  function handleBackToLogin() {
    setSubmitted(false);
    setEmail("");
    setError("");
    onBackToLogin();
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <button
          onClick={handleBackToLogin}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={28} className="text-green-700" />
          </div>

          <h2 className="text-2xl font-bold text-[#111111]">
            Check Your Email
          </h2>

          <p className="mt-3 text-slate-500">
            {successMessage}
          </p>

          <p className="mt-6 text-sm text-slate-400">
            The link will expire in 1 hour.
          </p>

          <button
            onClick={handleBackToLogin}
            className="mt-8 w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white hover:bg-[#0B472F] transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={handleBackToLogin}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>

      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
          Verdyra Capital
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#111111]">
          Forgot Password?
        </h2>
        <p className="mt-2 text-slate-500">
          Enter your admin email address and we'll send a reset link to your registered email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none transition-all duration-200"
              placeholder="Enter your admin email"
              autoComplete="email"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white hover:bg-[#0B472F] disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </div>
  );
}