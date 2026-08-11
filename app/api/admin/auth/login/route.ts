import { NextResponse } from "next/server";

import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  loginAdminWithSupabaseAuth,
} from "@/lib/server/adminAuth.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email.trim() || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter email and password.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await loginAdminWithSupabaseAuth(
      email,
      password
    );

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
      admin: result.admin,
    });

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

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Admin authentication could not be completed.",
      },
      {
        status: 500,
      }
    );
  }
}
