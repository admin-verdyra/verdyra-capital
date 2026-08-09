"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/components/portal/ForgotPasswordForm";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

export default function PortalLogin() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return <PortalLoginForm setShowForgotPassword={setShowForgotPassword} />;
}

function PortalLoginForm({ setShowForgotPassword }: { setShowForgotPassword: (value: boolean) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    if (!captchaChecked) {
      setError("Please confirm that you are not a robot.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        if (res.status === 403 && data?.code === "CUSTOMER_AUTH_MIGRATION_REQUIRED") {
          setError(
            "Your account needs to be upgraded to secure login. Please contact Verdyra support."
          );
          return;
        }

        setError("Invalid username or password.");
        return;
      }

      // Successful login: server sets HttpOnly cookies, return safe customer
      const customer = data.customer;

      if (customer) {
        try {
          sessionStorage.setItem("customer", JSON.stringify(customer));
        } catch (e) {
          // ignore sessionStorage failures
        }

        router.push("/portal/dashboard");
        return;
      }

      setError("Invalid username or password.");
    } catch (err) {
      setLoading(false);
      setError("Customer authentication could not be completed.");
    }
  }

  return (
    <div className="w-full max-w-md">

      <div className="text-center mb-6">
        {/* Secure Customer Portal badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F5A3A]/5 text-[#0F5A3A] text-xs font-medium uppercase tracking-[0.1em] mb-4">
          <Shield size={12} />
          Secure Customer Portal
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to access your funding portal
        </p>
      </div>

      <div className="space-y-4">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-slate-900 placeholder:text-slate-400 focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none focus:bg-white transition-all duration-200"
            placeholder="Enter your username"
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
              className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none focus:bg-white transition-all duration-200"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={(e) => setCaptchaChecked(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#0F5A3A] focus:ring-2 focus:ring-[#0F5A3A]/20"
          />
          <span className="text-sm text-slate-600">I'm not a robot</span>
        </label>

        {error && (
          <div className="rounded-xl bg-red-50 p-2.5 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-full bg-[#0F5A3A] py-3.5 font-semibold text-white hover:bg-[#0B472F] disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 focus:ring-2 focus:ring-[#0F5A3A]/20 focus:outline-none"
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
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-[#0F5A3A] hover:underline font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </p>

        {/* Subtle trust reassurance */}
        <p className="text-center text-xs text-slate-400 mt-2">
          Your account and documents are accessible only through your secure portal.
        </p>

      </div>
    </div>
  );
}
