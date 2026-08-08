"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSuccessMessage(data?.message ?? "If an account exists, a password reset link has been sent to the registered email address.");
      setSubmitted(true);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  function handleBackToLogin() {
    setSubmitted(false);
    setUsername("");
    setError("");
    onBackToLogin();
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <button
          onClick={handleBackToLogin}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Mail size={28} className="text-green-700" />
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
            className="mt-8 w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white"
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
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>

      <h2 className="text-3xl font-bold text-[#111111]">
        Forgot Password?
      </h2>

      <p className="mt-2 text-slate-500">
        Enter your username and we'll send a reset link to your registered email.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-10 py-3"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}