"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok || !result.success) {
      setError(result.message ?? "Invalid credentials.");
      return;
    }

    sessionStorage.setItem(
      "admin",
      JSON.stringify(result.admin)
    );

    router.push("/admin/dashboard");
  }

  return (
    <div className="w-full max-w-md">

      <h1 className="text-4xl font-bold">
        Admin Login
      </h1>

      <p className="mt-2 text-slate-500">
        Sign in to Verdyra Admin Portal
      </p>

      <div className="mt-10 space-y-5">

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

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
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </div>
  );
}
