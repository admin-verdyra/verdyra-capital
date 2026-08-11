"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (!captchaChecked) {
      setError("Please confirm that you are not a robot.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? "Invalid credentials.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "admin",
        JSON.stringify(result.admin)
      );

      router.push("/admin/dashboard");
    } catch {
      setError("Admin authentication could not be completed.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F5A3A]/10 text-[#0F5A3A] text-xs font-medium uppercase tracking-[0.1em] mb-3">
          <Shield size={12} />
          SECURE ADMIN PORTAL
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#111111] tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to manage your funding operations.
        </p>
      </div>

      <div className="space-y-4">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none transition-all duration-200"
            placeholder="Enter your email"
            autoComplete="username"
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none transition-all duration-200"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="grid w-full max-w-full grid-cols-[16px_1fr] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 transition-colors hover:bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={(e) => setCaptchaChecked(e.target.checked)}
            className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20"
          />
          <span className="justify-self-start whitespace-nowrap text-sm text-slate-600">
            I'm not a robot
          </span>
        </label>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-full bg-[#0F5A3A] py-3.5 font-semibold text-white hover:bg-[#0C4C31] disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          <a
            href="/admin/forgot-password"
            className="text-[#0F5A3A] hover:underline font-medium flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} />
            Forgot Password?
          </a>
        </p>

      </div>

    </div>
  );
}
