import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectTo = searchParams.get("redirect_to");

  // Diagnostic logging
  console.log("[admin verify] params:", {
    hasTokenHash: !!tokenHash,
    type,
    hasRedirectTo: !!redirectTo,
  });

  // Validate required parameters
  if (!tokenHash || type !== "recovery") {
    console.log("[admin verify] validation failed: missing token_hash or type !== recovery");
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invalid Link</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F8F7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 400px; padding: 2rem; }
    .icon { width: 64px; height: 64px; border-radius: 50%; background: #FEE2E2; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
    h1 { color: #111; font-size: 1.5rem; margin-bottom: 0.75rem; }
    p { color: #64748B; margin-bottom: 1.5rem; }
    a { display: inline-block; background: #0F5A3A; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <h1>Invalid or Expired Link</h1>
    <p>This password reset link is invalid or has expired. Please request a new one.</p>
    <a href="/admin">Return to Admin Login</a>
  </div>
</body>
</html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  const cookieStore = await cookies();

  // Create the redirect response FIRST so we can attach cookies to it
  const destination = redirectTo ? decodeURIComponent(redirectTo) : "/admin/reset-password";
  const response = NextResponse.redirect(new URL(destination, request.url));

  // Create Supabase SSR client with adapter that writes cookies to the RESPONSE
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verify the recovery token - this will call setAll on our response
  const { data, error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token_hash: tokenHash,
  });

  console.log("[admin verify] verifyOtp result:", {
    hasError: !!error,
    errorCode: error?.code,
    errorMessage: error?.message,
    hasSession: !!data?.session,
    hasUser: !!data?.user,
  });

  if (error || !data.session) {
    console.error("admin verifyOtp failed:", {
      code: error?.code,
      message: error?.message ?? "Unknown error"
    });

    // Idempotency: if token was already consumed (otp_expired) but a valid
    // session exists from the first verification, redirect instead of 400.
    if (error?.code === "otp_expired") {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return response;
      }
    }

    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invalid Link</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F8F7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 400px; padding: 2rem; }
    .icon { width: 64px; height: 64px; border-radius: 50%; background: #FEE2E2; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
    h1 { color: #111; font-size: 1.5rem; margin-bottom: 0.75rem; }
    p { color: #64748B; margin-bottom: 1.5rem; }
    a { display: inline-block; background: #0F5A3A; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    </div>
    <h1>Invalid or Expired Link</h1>
    <p>This password reset link is invalid or has expired. Please request a new one.</p>
    <a href="/admin">Return to Admin Login</a>
  </div>
</body>
</html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Success: return the response that already has Set-Cookie headers attached
  return response;
}