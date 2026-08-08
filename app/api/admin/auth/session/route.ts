import { NextResponse } from "next/server";

import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  getAdminFromSessionTokens,
} from "@/lib/server/adminAuth.server";

export async function GET(request: Request) {
  const accessToken = getCookieValue(
    request.headers.get("cookie") ?? "",
    ADMIN_ACCESS_TOKEN_COOKIE
  );
  const refreshToken = getCookieValue(
    request.headers.get("cookie") ?? "",
    ADMIN_REFRESH_TOKEN_COOKIE
  );

  const result = await getAdminFromSessionTokens(
    accessToken,
    refreshToken
  );

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        admin: null,
      },
      {
        status: 401,
      }
    );
  }

  const response = NextResponse.json({
    success: true,
    admin: result.admin,
  });

  if (result.session) {
    response.cookies.set({
      name: ADMIN_ACCESS_TOKEN_COOKIE,
      value: result.session.access_token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: result.session.expires_in,
    });

    response.cookies.set({
      name: ADMIN_REFRESH_TOKEN_COOKIE,
      value: result.session.refresh_token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });
  }

  return response;
}

function getCookieValue(cookieHeader: string, name: string) {
  const cookies = cookieHeader.split(";").map((cookie) => {
    const [key, ...value] = cookie.trim().split("=");

    return {
      key,
      value: value.join("="),
    };
  });

  return (
    cookies.find((cookie) => cookie.key === name)?.value ??
    ""
  );
}
