import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/server/adminAuth.server";
import {
  createSupabaseAuthUser,
  deleteSupabaseAuthUser,
} from "@/lib/server/supabaseAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";

type CreateCustomerRequest = {
  username?: unknown;
  password?: unknown;
  email?: unknown;
  full_name?: unknown;
  company?: unknown;
  phone?: unknown;
  loan_amount?: unknown;
  product?: unknown;
  application_status?: unknown;
  relationship_manager?: unknown;
  relationship_manager_phone?: unknown;
  expected_approval_date?: unknown;
  progress?: unknown;
};

type SafeCustomer = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  auth_user_id: string;
};

function validateEmail(email: unknown): email is string {
  if (typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: unknown): password is string {
  if (typeof password !== "string") {
    return false;
  }

  return password.length >= 8;
}

function validateUsername(username: unknown): username is string {
  if (typeof username !== "string") {
    return false;
  }

  return (
    username.trim().length >= 3 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
}

function toSafeCustomer(data: {
  id: string;
  username: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  auth_user_id: string;
}): SafeCustomer {
  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    company: data.company,
    phone: data.phone,
    relationship_manager: data.relationship_manager,
    relationship_manager_phone: data.relationship_manager_phone,
    auth_user_id: data.auth_user_id,
  };
}

export async function POST(request: Request) {
  try {
    // 1. Verify authenticated admin
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    // 2. Validate request data
    const body = await request.json();
    const body_typed = body as CreateCustomerRequest;

    const username = body_typed.username?.toString().trim();
    const password = body_typed.password?.toString();
    const email = body_typed.email?.toString().trim().toLowerCase();
    const fullName = body_typed.full_name?.toString().trim();
    const company = body_typed.company?.toString().trim() || null;
    const phone = body_typed.phone?.toString().trim() || null;

    // Validate required fields
    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username is required (3+ characters, alphanumeric/hyphen/underscore only).",
        },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required (minimum 8 characters).",
        },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid email is required.",
        },
        { status: 400 }
      );
    }

    if (!fullName || fullName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required.",
        },
        { status: 400 }
      );
    }

    // Optional fields
    const loanAmount =
      typeof body_typed.loan_amount === "number"
        ? body_typed.loan_amount
        : null;
    const product =
      typeof body_typed.product === "string"
        ? body_typed.product.trim() || null
        : null;
    const applicationStatus =
      typeof body_typed.application_status === "string"
        ? body_typed.application_status.trim() || null
        : null;
    const relationshipManager =
      typeof body_typed.relationship_manager === "string"
        ? body_typed.relationship_manager.trim() || null
        : null;
    const relationshipManagerPhone =
      typeof body_typed.relationship_manager_phone === "string"
        ? body_typed.relationship_manager_phone.trim() || null
        : null;
    const expectedApprovalDate =
      typeof body_typed.expected_approval_date === "string"
        ? body_typed.expected_approval_date.trim() || null
        : null;
    const progress =
      typeof body_typed.progress === "number"
        ? body_typed.progress
        : null;

    // 3. Check username uniqueness
    const supabase = createSupabaseServiceRoleClient();

    const { data: existingCustomer, error: selectError } =
      await supabase
        .from("customers")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists.",
        },
        { status: 409 }
      );
    }

    // 4. Create Supabase Auth user
    let authUserId: string;
    try {
      const authUser = await createSupabaseAuthUser({
        email,
        password,
        emailConfirm: true,
        userMetadata: {
          customer_username: username,
          full_name: fullName,
        },
      });

      authUserId = authUser.id;
    } catch (authError) {
      console.error("Auth user creation failed:", authError);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create authentication account.",
        },
        { status: 500 }
      );
    }

    // 5. Create customers row
    const { data: newCustomer, error: insertError } =
      await supabase
        .from("customers")
        .insert({
          username,
          password,
          full_name: fullName,
          email,
          company,
          phone,
          loan_amount: loanAmount,
          product: product,
          application_status: applicationStatus,
          relationship_manager: relationshipManager,
          relationship_manager_phone: relationshipManagerPhone,
          expected_approval_date: expectedApprovalDate,
          progress: progress,
          auth_user_id: authUserId,
        })
        .select(
          "id, username, full_name, email, company, phone, relationship_manager, relationship_manager_phone, auth_user_id"
        )
        .single();

    // 6. Handle rollback if INSERT fails
    if (insertError || !newCustomer) {
      console.error("Customer INSERT failed:", insertError);

      try {
        await deleteSupabaseAuthUser(authUserId);
      } catch (deleteError) {
        console.error(
          "Failed to rollback Auth user:",
          deleteError
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create customer record.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Merchant created successfully.",
      customer: toSafeCustomer({
        id: newCustomer.id,
        username: newCustomer.username,
        full_name: newCustomer.full_name,
        email: newCustomer.email,
        company: newCustomer.company,
        phone: newCustomer.phone,
        relationship_manager: newCustomer.relationship_manager,
        relationship_manager_phone: newCustomer.relationship_manager_phone,
        auth_user_id: newCustomer.auth_user_id,
      }),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Merchant creation could not be completed.",
      },
      { status: 500 }
    );
  }
}
