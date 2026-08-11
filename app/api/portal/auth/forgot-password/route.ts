import { NextResponse } from "next/server";

import { getCustomerByUsername } from "@/lib/server/customerAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import { sendPasswordResetEmail } from "@/lib/server/email.server";

const GENERIC_SUCCESS_MESSAGE =
  "If an account exists, a password reset link has been sent to the registered email address.";

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
    const username = typeof body.username === "string" ? body.username.trim() : "";

    if (!username) {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    const customer = await getCustomerByUsername(username);

    if (!customer) {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    if (customer.account_status !== "active") {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    if (!customer.email || !customer.auth_user_id) {
      return NextResponse.json(
        { success: true, message: GENERIC_SUCCESS_MESSAGE },
        { status: 200 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    const verifyUrl = `${getAppUrl()}/api/portal/auth/reset-password/verify`;

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: customer.email,
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
      redirect_to: "/portal/reset-password",
    }).toString()}`;

    // Diagnostic: log success (no sensitive data)
    console.log("Recovery link generated successfully");

    await sendPasswordResetEmail(customer.email, resetLink);

    return NextResponse.json(
      { success: true, message: GENERIC_SUCCESS_MESSAGE },
      { status: 200 }
    );
  } catch {
    console.error("forgot-password error: unexpected failure");
    return NextResponse.json(
      { success: true, message: GENERIC_SUCCESS_MESSAGE },
      { status: 200 }
    );
  }
}