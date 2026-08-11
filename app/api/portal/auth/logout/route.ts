import { NextResponse } from "next/server";

import {
  CUSTOMER_ACCESS_TOKEN_COOKIE,
  CUSTOMER_REFRESH_TOKEN_COOKIE,
} from "@/lib/server/customerAuth.server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.delete(CUSTOMER_ACCESS_TOKEN_COOKIE);
  response.cookies.delete(CUSTOMER_REFRESH_TOKEN_COOKIE);

  return response;
}
