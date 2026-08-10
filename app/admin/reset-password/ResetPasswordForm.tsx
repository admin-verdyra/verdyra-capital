"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setHasSession(!!session);
      setSessionReady(true);
    };
    checkSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      console.error("updateUser error:", { message: error.message });
      setError("Failed to update password. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (!sessionReady) {
    return (
      <main className="min-h-screen bg-[#F6F8F7] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center h-16">
            <Loader2 size={32} className="text-[#0F5A3A] animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen bg-[#F6F8F7] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle size={28} className="text-red-700" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111]">
            Invalid or Expired Link
          </h2>
          <p className="mt-3 text-slate-500">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="mt-8 w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white"
          >
            Return to Admin Login
          </button>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#F6F8F7] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={28} className="text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111]">
            Password Updated
          </h2>
          <p className="mt-3 text-slate-500">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="mt-8 w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white"
          >
            Go to Admin Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8F7] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="grid w-full overflow-hidden rounded-[36px] bg-white shadow-2xl">
          <div className="flex flex-col justify-center bg-[#0F5A3A] p-12 text-white lg:hidden">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
              Verdyra Capital
            </p>
            <h1 className="mt-6 text-3xl font-bold leading-tight">
              Reset Password
            </h1>
          </div>

          <div className="flex items-center justify-center p-12 lg:p-16">
            <div className="w-full max-w-md">
              <div className="hidden lg:block text-center mb-8">
                <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                  Verdyra Capital
                </p>
                <h1 className="mt-2 text-4xl font-bold text-[#111111]">
                  Set New Password
                </h1>
                <p className="mt-2 text-slate-500">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-300 px-10 py-3"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-300 px-10 py-3"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
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
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <button
                  onClick={() => router.push("/admin")}
                  className="text-[#0F5A3A] hover:underline font-medium"
                >
                  Back to Admin Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}