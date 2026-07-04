"use client";

import { useState } from "react";
import { loginCustomer } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function PortalLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    const customer = await loginCustomer(username, password);

    setLoading(false);

    if (!customer) {
      setError("Invalid username or password.");
      return;
    }

    sessionStorage.setItem(
  "customer",
  JSON.stringify(customer)
);

router.push("/portal/dashboard");

    // Next step:
    // router.push("/portal/dashboard")
  }

  return (
    <div className="w-full max-w-md">

      <h2 className="text-3xl font-bold text-[#111111]">
        Welcome Back
      </h2>

      <p className="mt-2 text-slate-500">
        Login to continue
      </p>

      <div className="mt-10 space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Username
          </label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border p-4">
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={(e) => setCaptchaChecked(e.target.checked)}
          />
          I'm not a robot
        </label>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-full bg-[#0F5A3A] py-4 font-semibold text-white"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

      </div>
    </div>
  );
}