import { NextResponse } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import { sendPasswordResetEmail } from "@/lib/server/email.server";

const GENERIC_SUCCESS_MESSAGE =
  "If an account exists for this email address, you will receive a password reset link shortly.";

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_APP_URL");
  }
  return url.replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    // Look up admin by email (case-insensitive)
    const supabase = createSupabaseServiceRoleClient();
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, email, auth_user_id")
      .ilike("email", email)
      .maybeSingle();

    if (adminError) {
      console.error("Admin lookup error:", { message: adminError.message });
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    // Always return generic success - do not reveal if admin exists
    if (!admin || !admin.auth_user_id) {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    // Generate recovery link using Supabase Auth
    const verifyUrl = `${getAppUrl()}/api/admin/auth/reset-password/verify`;

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: admin.email,
      options: {
        redirectTo: verifyUrl,
      },
    });

    if (error || !data?.properties?.hashed_token) {
      console.error("Recovery token generation failed:", {
        code: (error as { code?: string } | null)?.code ?? "UNKNOWN",
        message: (error as { message?: string } | null)?.message ?? "Unknown error",
      });
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    const tokenHash = data.properties.hashed_token;

    // Construct OUR verification URL with the token_hash
    const resetLink = `${verifyUrl}?${new URLSearchParams({
      token_hash: tokenHash,
      type: "recovery",
      redirect_to: "/admin/reset-password",
    }).toString()}`;

    // Diagnostic: log success (no sensitive data)
    console.log("Admin recovery link generated successfully");

    // Send the recovery email
    await sendPasswordResetEmail(admin.email, resetLink);

    return NextResponse.json(
      { success: true, message: GENERIC_SUCCESS_MESSAGE },
      { status: 200 }
    );
  } catch {
    console.error("admin forgot-password error: unexpected failure");
    return NextResponse.json(
      { success: true, message: GENERIC_SUCCESS_MESSAGE },
      { status: 200 }
    );
  }
}