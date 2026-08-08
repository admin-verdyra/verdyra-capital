import { NextResponse } from "next/server";

import {
  CUSTOMER_ACCESS_TOKEN_COOKIE,
  CUSTOMER_REFRESH_TOKEN_COOKIE,
  getCustomerFromSessionTokens,
} from "@/lib/server/customerAuth.server";

export async function GET(request: Request) {
  const accessToken = getCookieValue(
    request.headers.get("cookie") ?? "",
    CUSTOMER_ACCESS_TOKEN_COOKIE
  );
  const refreshToken = getCookieValue(
    request.headers.get("cookie") ?? "",
    CUSTOMER_REFRESH_TOKEN_COOKIE
  );

  const result = await getCustomerFromSessionTokens(
    accessToken,
    refreshToken
  );

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        customer: null,
      },
      {
        status: 401,
      }
    );
  }

  const response = NextResponse.json({
    success: true,
    customer: result.customer,
  });

  if (result.session) {
    response.cookies.set({
      name: CUSTOMER_ACCESS_TOKEN_COOKIE,
      value: result.session.access_token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: result.session.expires_in,
    });

    response.cookies.set({
      name: CUSTOMER_REFRESH_TOKEN_COOKIE,
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
    cookies.find((cookie) => cookie.key === name)?.value ?? ""
  );
}
