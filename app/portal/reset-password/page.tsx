"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F6F8F7] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center h-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0F5A3A] border-t-transparent" />
          </div>
        </div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}