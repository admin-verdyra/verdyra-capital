import { NextResponse } from "next/server";

import { requireSuperAdmin } from "@/lib/server/adminAuth.server";
import {
  createSupabaseAuthUser,
  deleteSupabaseAuthUser,
  findSupabaseAuthUserByEmail,
} from "@/lib/server/supabaseAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import {
  sendAdminWelcomeEmail,
  sendMerchantAssignmentEmail,
} from "@/lib/server/email.server";

type CreateAdminRequest = {
  username?: unknown;
  password?: unknown;
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
};

function validateUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;

  const value = username.trim();

  return (
    value.length >= 3 &&
    value.length <= 50 &&
    /^[a-zA-Z0-9_-]+$/.test(value)
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 128
  );
}

function validateEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;

  const value = email.trim().toLowerCase();

  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function validateName(name: unknown): name is string {
  if (typeof name !== "string") return false;

  const value = name.trim();

  return value.length >= 2 && value.length <= 100;
}

function validatePhone(phone: unknown): phone is string {
  if (typeof phone !== "string") return false;

  const value = phone.trim();

  return value.length >= 7 && value.length <= 20;
}

function isDuplicateError(error: unknown): boolean {
  const candidate = error as {
    code?: string;
    message?: string;
    status?: number;
  } | null;

  const message = candidate?.message?.toLowerCase() ?? "";

  return (
    candidate?.code === "23505" ||
    candidate?.status === 409 ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("duplicate")
  );
}

export async function GET(request: Request) {
  try {
    await requireSuperAdmin();

    const supabase = createSupabaseServiceRoleClient();

    const url = new URL(request.url);
    const merchantsForAdminId =
      url.searchParams.get("merchants_for_admin_id")?.trim() || "";

    if (merchantsForAdminId) {
      const { data: merchants, error: merchantError } =
        await supabase
          .from("customers")
          .select(
            "id, username, full_name, email, company, loan_amount, product, application_status, account_status, created_at"
          )
          .eq(
            "created_by_admin_id",
            merchantsForAdminId
          )
          .order("created_at", {
            ascending: false,
          });

      if (merchantError) {
        throw merchantError;
      }

      return NextResponse.json({
        success: true,
        merchants: merchants ?? [],
      });
    }

    const { data, error } = await supabase
      .from("admins")
      .select(
        "id, username, full_name, email, phone, role, auth_user_id, created_at, account_status"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      admins: data ?? [],
    });
  } catch (error) {
    const candidate = error as {
      message?: string;
      code?: string;
    } | null;

    if (
      candidate?.message === "Admin authentication required."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    if (
      candidate?.code === "ADMIN_AUTHORIZATION_ERROR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    console.error("Admin list failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load Admin accounts.",
      },
      { status: 500 }
    );
  }
}


/**
 * PATCH /api/admin/admins
 *
 * Super Admin only.
 *
 * Enables or disables an Admin account.
 */
export async function PATCH(request: Request) {
  try {
    const superAdmin = await requireSuperAdmin();

    const body = (await request.json()) as {
      admin_id?: unknown;
      account_status?: unknown;
      action?: unknown;
      target_admin_id?: unknown;
      customer_ids?: unknown;
    };

    const adminId =
      typeof body.admin_id === "string"
        ? body.admin_id.trim()
        : "";

    const accountStatus = body.account_status;

    const action =
      typeof body.action === "string"
        ? body.action.trim()
        : "";

    const targetAdminId =
      typeof body.target_admin_id === "string"
        ? body.target_admin_id.trim()
        : "";

    const customerIds = Array.isArray(body.customer_ids)
      ? body.customer_ids.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
      : [];

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "transfer_merchants" &&
      accountStatus !== "active" &&
      accountStatus !== "disabled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Account status must be active or disabled.",
        },
        { status: 400 }
      );
    }

    if (action !== "transfer_merchants" && adminId === superAdmin.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot disable or modify your own Super Admin account.",
        },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseServiceRoleClient();

    /*
     * Super Admin-only merchant portfolio transfer.
     *
     * admin_id = source Admin
     * target_admin_id = destination Admin
     * customer_ids = merchants explicitly selected by Super Admin
     */
    if (action === "transfer_merchants") {
      if (!adminId) {
        return NextResponse.json(
          {
            success: false,
            message: "Source Admin ID is required.",
          },
          { status: 400 }
        );
      }

      if (!targetAdminId) {
        return NextResponse.json(
          {
            success: false,
            message: "Target Admin ID is required.",
          },
          { status: 400 }
        );
      }

      if (adminId === targetAdminId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Merchants cannot be transferred to the same Admin.",
          },
          { status: 400 }
        );
      }

      if (customerIds.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Select at least one merchant to transfer.",
          },
          { status: 400 }
        );
      }

      const { data: sourceAdmin, error: sourceError } =
        await supabase
          .from("admins")
          .select(
            "id, username, full_name, email, role, account_status"
          )
          .eq("id", adminId)
          .maybeSingle();

      if (sourceError) {
        throw sourceError;
      }

      if (!sourceAdmin) {
        return NextResponse.json(
          {
            success: false,
            message: "Source Admin not found.",
          },
          { status: 404 }
        );
      }

      const { data: destinationAdmin, error: destinationError } =
        await supabase
          .from("admins")
          .select(
            "id, username, full_name, email, role, account_status"
          )
          .eq("id", targetAdminId)
          .maybeSingle();

      if (destinationError) {
        throw destinationError;
      }

      if (!destinationAdmin) {
        return NextResponse.json(
          {
            success: false,
            message: "Target Admin not found.",
          },
          { status: 404 }
        );
      }

      if (destinationAdmin.account_status !== "active") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Merchants can only be transferred to an active Admin.",
          },
          { status: 400 }
        );
      }

      /*
       * Fetch ONLY merchants that:
       * 1. were explicitly selected
       * 2. are actually owned by the source Admin
       *
       * This prevents a crafted request from transferring
       * another Admin's merchant.
       */
      const { data: selectedMerchants, error: merchantFetchError } =
        await supabase
          .from("customers")
          .select("id, full_name, company, username")
          .in("id", customerIds)
          .eq("created_by_admin_id", sourceAdmin.id);

      if (merchantFetchError) {
        throw merchantFetchError;
      }

      const merchants = selectedMerchants ?? [];

      const foundIds = new Set(
        merchants.map((merchant) => merchant.id)
      );

      const unauthorizedIds = customerIds.filter(
        (id) => !foundIds.has(id)
      );

      if (unauthorizedIds.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more selected merchants are no longer owned by the source Admin. Refresh the list and try again.",
          },
          { status: 409 }
        );
      }

      const { data: transferredMerchants, error: transferError } =
        await supabase
          .from("customers")
          .update({
            created_by_admin_id: destinationAdmin.id,
          })
          .in("id", customerIds)
          .eq("created_by_admin_id", sourceAdmin.id)
          .select("id, full_name, company, username");

      if (transferError) {
        throw transferError;
      }

      const transferred = transferredMerchants ?? [];
      const merchantCount = transferred.length;

      if (merchantCount !== customerIds.length) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The transfer could not be completed for all selected merchants. No partial transfer should be relied upon; refresh the merchant list before retrying.",
          },
          { status: 409 }
        );
      }

      const merchantNames = transferred.map(
        (merchant) =>
          merchant.company ||
          merchant.full_name ||
          merchant.username ||
          "Merchant"
      );

      let emailSent = false;
      let emailError: string | undefined;

      if (
        destinationAdmin.role !== "Super Admin" &&
        destinationAdmin.email
      ) {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000";

        const emailResult =
          await sendMerchantAssignmentEmail(
            destinationAdmin.email,
            destinationAdmin.full_name,
            merchantNames,
            `${appUrl.replace(/\/$/, "")}/admin/dashboard`
          );

        emailSent = emailResult.success;
        emailError = emailResult.error;
      }

      return NextResponse.json({
        success: true,
        message:
          `${merchantCount} ${
            merchantCount === 1
              ? "merchant was"
              : "merchants were"
          } transferred from ${sourceAdmin.full_name} to ${destinationAdmin.full_name}.`,
        merchant_count: merchantCount,
        merchant_names: merchantNames,
        source_admin: {
          id: sourceAdmin.id,
          username: sourceAdmin.username,
          full_name: sourceAdmin.full_name,
        },
        target_admin: {
          id: destinationAdmin.id,
          username: destinationAdmin.username,
          full_name: destinationAdmin.full_name,
          role: destinationAdmin.role,
        },
        email_sent: emailSent,
        ...(emailError
          ? {
              email_warning:
                "Merchant transfer succeeded, but the assignment email could not be sent.",
            }
          : {}),
      });
    }

    const { data: targetAdmin, error: fetchError } =
      await supabase
        .from("admins")
        .select(
          "id, username, full_name, email, role, auth_user_id, account_status"
        )
        .eq("id", adminId)
        .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!targetAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found.",
        },
        { status: 404 }
      );
    }

    if (targetAdmin.role === "Super Admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin accounts cannot be disabled.",
        },
        { status: 400 }
      );
    }

    if (
      targetAdmin.account_status === accountStatus
    ) {
      return NextResponse.json({
        success: true,
        message:
          accountStatus === "disabled"
            ? "Admin is already disabled."
            : "Admin is already active.",
        admin: targetAdmin,
      });
    }

    const { data: updatedAdmin, error: updateError } =
      await supabase
        .from("admins")
        .update({
          account_status: accountStatus,
        })
        .eq("id", adminId)
        .select(
          "id, username, full_name, email, role, auth_user_id, account_status"
        )
        .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message:
        accountStatus === "disabled"
          ? "Admin disabled successfully."
          : "Admin enabled successfully.",
      admin: updatedAdmin,
    });
  } catch (error) {
    const candidate = error as {
      message?: string;
      code?: string;
    } | null;

    if (
      candidate?.message ===
      "Admin authentication required."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    if (
      candidate?.code ===
      "ADMIN_AUTHORIZATION_ERROR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    console.error("Admin status update failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update Admin account status.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/admins
 *
 * Super Admin only.
 *
 * Admins can only be permanently deleted if they do not
 * own any merchants.
 */
export async function DELETE(request: Request) {
  try {
    const superAdmin = await requireSuperAdmin();

    const body = (await request.json()) as {
      admin_id?: unknown;
    };

    const adminId =
      typeof body.admin_id === "string"
        ? body.admin_id.trim()
        : "";

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required.",
        },
        { status: 400 }
      );
    }

    if (adminId === superAdmin.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot delete your own Super Admin account.",
        },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseServiceRoleClient();

    const { data: targetAdmin, error: fetchError } =
      await supabase
        .from("admins")
        .select(
          "id, username, full_name, email, role, auth_user_id"
        )
        .eq("id", adminId)
        .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!targetAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found.",
        },
        { status: 404 }
      );
    }

    if (targetAdmin.role === "Super Admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin accounts cannot be deleted.",
        },
        { status: 400 }
      );
    }

    const { count: merchantCount, error: countError } =
      await supabase
        .from("customers")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("created_by_admin_id", adminId);

    if (countError) {
      throw countError;
    }

    if ((merchantCount ?? 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Admin cannot be deleted because they still own merchants. Disable the Admin instead, or transfer the merchants before deletion.",
          merchant_count: merchantCount ?? 0,
        },
        { status: 409 }
      );
    }

    if (targetAdmin.auth_user_id) {
      try {
        await deleteSupabaseAuthUser(
          targetAdmin.auth_user_id
        );
      } catch (authError) {
        console.error(
          "Failed to delete Admin Auth user:",
          authError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to delete the Admin authentication account.",
          },
          { status: 500 }
        );
      }
    }

    const { error: deleteError } =
      await supabase
        .from("admins")
        .delete()
        .eq("id", adminId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    const candidate = error as {
      message?: string;
      code?: string;
    } | null;

    if (
      candidate?.message ===
      "Admin authentication required."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    if (
      candidate?.code ===
      "ADMIN_AUTHORIZATION_ERROR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    console.error("Admin deletion failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete Admin account.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let authUserId: string | null = null;

  try {
    const superAdmin = await requireSuperAdmin();

    const body =
      (await request.json()) as CreateAdminRequest;

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username must be 3-50 characters and contain only letters, numbers, hyphens or underscores.",
        },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be between 8 and 128 characters.",
        },
        { status: 400 }
      );
    }

    if (!validateName(fullName)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Admin name.",
        },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: existingUsername, error: usernameError } =
      await supabase
        .from("admins")
        .select("id, username")
        .ilike("username", username)
        .maybeSingle();

    if (usernameError) throw usernameError;

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin username already exists.",
        },
        { status: 409 }
      );
    }

    const { data: existingAdminEmail, error: adminEmailError } =
      await supabase
        .from("admins")
        .select("id, email")
        .ilike("email", email)
        .maybeSingle();

    if (adminEmailError) throw adminEmailError;

    if (existingAdminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "An Admin already exists with this email.",
        },
        { status: 409 }
      );
    }

    const existingAuthUser =
      await findSupabaseAuthUserByEmail(email);

    if (existingAuthUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A Supabase account already exists with this email.",
        },
        { status: 409 }
      );
    }

    let authUser;

    try {
      authUser = await createSupabaseAuthUser({
        email,
        password,
        emailConfirm: true,
        userMetadata: {
          role: "Admin",
          admin_username: username,
          full_name: fullName,
          email_verified: true,
          created_by_admin_id: superAdmin.id,
        },
      });

      authUserId = authUser.id;
    } catch (authError) {
      console.error("Admin Auth creation failed:", {
        message:
          authError instanceof Error
            ? authError.message
            : "Unknown error",
      });

      if (isDuplicateError(authError)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A Supabase account already exists with this email.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create the Admin authentication account.",
        },
        { status: 500 }
      );
    }

    const { data: newAdmin, error: insertError } =
      await supabase
        .from("admins")
        .insert({
          username,
          full_name: fullName,
          email,
          phone,
          role: "Admin",
          auth_user_id: authUserId,
        })
        .select(
          "id, username, full_name, email, phone, role, auth_user_id, created_at, account_status"
        )
        .single();

    if (insertError || !newAdmin) {
      console.error(
        "Admin database creation failed:",
        insertError
      );

      if (authUserId) {
        try {
          await deleteSupabaseAuthUser(authUserId);
        } catch (rollbackError) {
          console.error(
            "Failed to rollback Admin Auth user:",
            rollbackError
          );
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to create the Admin record.",
        },
        { status: 500 }
      );
    }

    const adminUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://verdyra-capital.vercel.app/admin";

    let welcomeEmailSent = true;

    try {
      const emailResult = await sendAdminWelcomeEmail(
        email,
        fullName,
        username,
        password,
        adminUrl
      );

      welcomeEmailSent = emailResult.success;

      if (!emailResult.success) {
        console.error("Admin welcome email failed:", {
          username,
          email,
          error: emailResult.error,
        });
      }
    } catch (emailError) {
      welcomeEmailSent = false;

      console.error("Admin welcome email exception:", {
        username,
        email,
        message:
          emailError instanceof Error
            ? emailError.message
            : "Unknown error",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: welcomeEmailSent
          ? "Admin created successfully and welcome email sent."
          : "Admin created successfully, but the welcome email could not be sent.",
        admin: newAdmin,
        welcome_email_sent: welcomeEmailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    const candidate = error as {
      message?: string;
      code?: string;
    } | null;

    if (
      candidate?.message === "Admin authentication required."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    if (
      candidate?.code === "ADMIN_AUTHORIZATION_ERROR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    console.error("Admin creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Admin creation could not be completed.",
      },
      { status: 500 }
    );
  }
}
