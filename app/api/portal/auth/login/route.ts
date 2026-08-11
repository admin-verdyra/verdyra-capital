import { NextResponse } from "next/server";

import {
  CUSTOMER_ACCESS_TOKEN_COOKIE,
  CUSTOMER_REFRESH_TOKEN_COOKIE,
  loginCustomerWithSupabaseAuth,
  CustomerAuthMigrationRequired,
} from "@/lib/server/customerAuth.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? body.username : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!username.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter username and password.",
        },
        {
          status: 400,
        }
      );
    }

    let result;

    try {
      result = await loginCustomerWithSupabaseAuth(
        username,
        password
      );
    } catch (err: unknown) {
      if (err instanceof CustomerAuthMigrationRequired) {
        return NextResponse.json(
          {
            success: false,
            code: "CUSTOMER_AUTH_MIGRATION_REQUIRED",
            message:
              "Your account needs to be upgraded to secure login. Please contact Verdyra support.",
          },
          {
            status: 403,
          }
        );
      }

      console.error(err);
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication could not be completed.",
        },
        {
          status: 500,
        }
      );
    }

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
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

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Customer authentication could not be completed.",
      },
      {
        status: 500,
      }
    );
  }
}
