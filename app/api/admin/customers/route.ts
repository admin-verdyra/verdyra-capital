import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/server/adminAuth.server";
import {
  createSupabaseAuthUser,
  deleteSupabaseAuthUser,
  findSupabaseAuthUserByEmail,
} from "@/lib/server/supabaseAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";
import { sendWelcomeEmail } from "@/lib/server/email.server";

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
  relationship_manager_email?: unknown;
  relationship_manager_phone?: unknown;
  expected_approval_date?: unknown;
  progress?: unknown;
};

type UpdateCustomerRequest = {
  username?: unknown;
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  date_of_birth?: unknown;
  loan_amount?: unknown;
  product?: unknown;
  application_status?: unknown;
  relationship_manager?: unknown;
  relationship_manager_email?: unknown;
  relationship_manager_phone?: unknown;
  expected_approval_date?: unknown;
  progress?: unknown;
};

type UpdateAccountStatusRequest = {
  username?: unknown;
  account_status?: unknown;
};

type SafeCustomer = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  date_of_birth: string | null;
  relationship_manager: string | null;
  relationship_manager_email: string | null;
  relationship_manager_phone: string | null;
  auth_user_id: string;
  account_status: 'active' | 'disabled';
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

function validateDate(date: unknown): date is string {
  if (typeof date !== "string") {
    return false;
  }
  // Validate YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  // Validate it's a real date
  const d = new Date(date);
  return !isNaN(d.getTime());
}

function validateProgress(progress: unknown): progress is number {
  if (typeof progress !== "number") {
    return false;
  }
  return Number.isInteger(progress) && progress >= 0 && progress <= 100;
}

function validateLoanAmount(amount: unknown): amount is number {
  if (typeof amount !== "number") {
    return false;
  }
  return amount > 0;
}

function toSafeCustomer(data: {
  id: string;
  username: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  date_of_birth: string | null;
  relationship_manager: string | null;
  relationship_manager_email: string | null;
  relationship_manager_phone: string | null;
  auth_user_id: string;
  account_status: 'active' | 'disabled';
}): SafeCustomer {
  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    company: data.company,
    phone: data.phone,
    date_of_birth: data.date_of_birth,
    relationship_manager: data.relationship_manager,
    relationship_manager_email: data.relationship_manager_email,
    relationship_manager_phone: data.relationship_manager_phone,
    auth_user_id: data.auth_user_id,
    account_status: data.account_status,
  };
}

function validateAccountStatus(status: unknown): status is 'active' | 'disabled' {
  return status === 'active' || status === 'disabled';
}

export async function PATCH(request: Request) {
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

    // Check if this is an account_status update (discriminator)
    const hasAccountStatus = 'account_status' in body;
    const hasCustomerFields = Object.keys(body).some(
      (k) => k !== 'username' && k !== 'account_status'
    );

    // Handle account status update
    if (hasAccountStatus && !hasCustomerFields) {
      const body_typed = body as UpdateAccountStatusRequest;

      const username = body_typed.username?.toString().trim();
      const accountStatus = body_typed.account_status;

      if (!username) {
        return NextResponse.json(
          {
            success: false,
            message: "Username is required.",
          },
          { status: 400 }
        );
      }

      if (!validateAccountStatus(accountStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid account status. Must be 'active' or 'disabled'.",
          },
          { status: 400 }
        );
      }

      // Update account status
      const supabase = createSupabaseServiceRoleClient();

      const { data: updatedCustomer, error: updateError } = await supabase
        .from("customers")
        .update({
          account_status: accountStatus,
        })
        .eq("username", username)
        .select(
          "id, username, full_name, email, company, phone, date_of_birth, relationship_manager, relationship_manager_email, relationship_manager_phone, auth_user_id, account_status"
        )
        .single();

      if (updateError || !updatedCustomer) {
        return NextResponse.json(
          {
            success: false,
            message: "Customer not found or update failed.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Account ${accountStatus === 'active' ? 'enabled' : 'disabled'} successfully.`,
        customer: toSafeCustomer({
          id: updatedCustomer.id,
          username: updatedCustomer.username,
          full_name: updatedCustomer.full_name,
          email: updatedCustomer.email,
          company: updatedCustomer.company,
          phone: updatedCustomer.phone,
          date_of_birth: updatedCustomer.date_of_birth,
          relationship_manager: updatedCustomer.relationship_manager,
          relationship_manager_email: updatedCustomer.relationship_manager_email,
          relationship_manager_phone: updatedCustomer.relationship_manager_phone,
          auth_user_id: updatedCustomer.auth_user_id,
          account_status: updatedCustomer.account_status,
        }),
      });
    }

    // Handle customer field update
    const body_typed = body as UpdateCustomerRequest;

    const username = body_typed.username?.toString().trim();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required.",
        },
        { status: 400 }
      );
    }

    // Extract and validate fields
    const fullName = body_typed.full_name?.toString().trim();
    const email = body_typed.email?.toString().trim().toLowerCase();
    const phone = body_typed.phone?.toString().trim() || null;
    const company = body_typed.company?.toString().trim() || null;
    const dateOfBirth = body_typed.date_of_birth?.toString().trim() || null;
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
    const relationshipManagerEmail =
      typeof body_typed.relationship_manager_email === "string"
        ? body_typed.relationship_manager_email.trim() || null
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

    // Validate fields if provided
    if (fullName !== undefined) {
      if (!fullName || fullName.length === 0 || fullName.length > 255) {
        return NextResponse.json(
          {
            success: false,
            message: "Full name is required (1-255 characters).",
          },
          { status: 400 }
        );
      }
    }

    if (email !== undefined) {
      if (!validateEmail(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Valid email is required.",
          },
          { status: 400 }
        );
      }
    }

    if (phone !== undefined && phone !== null && phone.length > 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number too long (max 20 characters).",
        },
        { status: 400 }
      );
    }

    if (company !== undefined && company !== null && company.length > 255) {
      return NextResponse.json(
        {
          success: false,
          message: "Company name too long (max 255 characters).",
        },
        { status: 400 }
      );
    }

    if (dateOfBirth !== undefined && dateOfBirth !== null && !validateDate(dateOfBirth)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date of birth format. Use YYYY-MM-DD.",
        },
        { status: 400 }
      );
    }

    if (loanAmount !== undefined && loanAmount !== null && !validateLoanAmount(loanAmount)) {
      return NextResponse.json(
        {
          success: false,
          message: "Loan amount must be a positive number.",
        },
        { status: 400 }
      );
    }

    if (progress !== undefined && progress !== null && !validateProgress(progress)) {
      return NextResponse.json(
        {
          success: false,
          message: "Progress must be an integer between 0 and 100.",
        },
        { status: 400 }
      );
    }

    if (relationshipManager !== undefined && relationshipManager !== null && relationshipManager.length > 255) {
      return NextResponse.json(
        {
          success: false,
          message: "Relationship manager name too long (max 255 characters).",
        },
        { status: 400 }
      );
    }

    if (relationshipManagerPhone !== undefined && relationshipManagerPhone !== null && relationshipManagerPhone.length > 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Relationship manager phone too long (max 20 characters).",
        },
        { status: 400 }
      );
    }

    if (relationshipManagerEmail !== undefined && relationshipManagerEmail !== null && relationshipManagerEmail.length > 255) {
      return NextResponse.json(
        {
          success: false,
          message: "Relationship manager email too long (max 255 characters).",
        },
        { status: 400 }
      );
    }

    if (relationshipManagerEmail !== undefined && relationshipManagerEmail !== null && !validateEmail(relationshipManagerEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid relationship manager email is required.",
        },
        { status: 400 }
      );
    }

    if (expectedApprovalDate !== undefined && expectedApprovalDate !== null && !validateDate(expectedApprovalDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expected approval date format. Use YYYY-MM-DD.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    // 3. Get current customer to check auth_user_id and current email
    const { data: currentCustomer, error: selectError } = await supabase
      .from("customers")
      .select("id, auth_user_id, email, account_status")
      .eq("username", username)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (!currentCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found.",
        },
        { status: 404 }
      );
    }

    const authUserId = currentCustomer.auth_user_id;
    const oldEmail = currentCustomer.email;

    // 4. If email is being changed, validate uniqueness and sync with Supabase Auth
    if (email !== undefined && email !== oldEmail) {
      // Check email uniqueness in customers table
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("username")
        .eq("email", email)
        .neq("username", username)
        .maybeSingle();

      if (existingCustomer) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already in use by another customer.",
          },
          { status: 409 }
        );
      }

      // Check email uniqueness in Supabase Auth
      if (authUserId) {
        const existingAuthUser = await findSupabaseAuthUserByEmail(email);
        if (existingAuthUser && existingAuthUser.id !== authUserId) {
          return NextResponse.json(
            {
              success: false,
              message: "Email already associated with another authentication account.",
            },
            { status: 409 }
          );
        }
      }

      // Update Supabase Auth user email FIRST
      if (authUserId) {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          authUserId,
          {
            email,
            email_confirm: true,
          }
        );

        if (authUpdateError) {
          console.error("Supabase Auth email update failed:", {
            code: authUpdateError.code ?? "UNKNOWN",
            message: authUpdateError.message ?? "Unknown error",
          });
          return NextResponse.json(
            {
              success: false,
              message: "Failed to update authentication account email.",
            },
            { status: 500 }
          );
        }
      }
    }

    // 5. Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (fullName !== undefined) updateData.full_name = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (dateOfBirth !== undefined) updateData.date_of_birth = dateOfBirth;
    if (loanAmount !== undefined) updateData.loan_amount = loanAmount;
    if (product !== undefined) updateData.product = product;
    if (applicationStatus !== undefined) updateData.application_status = applicationStatus;
    if (relationshipManager !== undefined) updateData.relationship_manager = relationshipManager;
    if (relationshipManagerEmail !== undefined) updateData.relationship_manager_email = relationshipManagerEmail;
    if (relationshipManagerPhone !== undefined) updateData.relationship_manager_phone = relationshipManagerPhone;
    if (expectedApprovalDate !== undefined) updateData.expected_approval_date = expectedApprovalDate;
    if (progress !== undefined) updateData.progress = progress;

    // 6. Update customers table
    const { data: updatedCustomer, error: updateError } = await supabase
      .from("customers")
      .update(updateData)
      .eq("username", username)
      .select(
        "id, username, full_name, email, company, phone, date_of_birth, relationship_manager, relationship_manager_email, relationship_manager_phone, auth_user_id, account_status"
      )
      .single();

    // 7. Handle rollback if email was changed but customer update failed
    if (updateError || !updatedCustomer) {
      console.error("Customer UPDATE failed:", updateError);

      // Rollback Supabase Auth email if it was changed
      if (email !== undefined && email !== oldEmail && authUserId) {
        try {
          await supabase.auth.admin.updateUserById(authUserId, {
            email: oldEmail,
            email_confirm: true,
          });
        } catch (rollbackError) {
          console.error("Failed to rollback Auth email:", rollbackError);
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update customer record.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully.",
      customer: toSafeCustomer({
        id: updatedCustomer.id,
        username: updatedCustomer.username,
        full_name: updatedCustomer.full_name,
        email: updatedCustomer.email,
        company: updatedCustomer.company,
        phone: updatedCustomer.phone,
        date_of_birth: updatedCustomer.date_of_birth,
        relationship_manager: updatedCustomer.relationship_manager,
        relationship_manager_email: updatedCustomer.relationship_manager_email,
        relationship_manager_phone: updatedCustomer.relationship_manager_phone,
        auth_user_id: updatedCustomer.auth_user_id,
        account_status: updatedCustomer.account_status,
      }),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Customer update could not be completed.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
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

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toString().trim();

    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid username is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id, username, auth_user_id")
      .eq("username", username)
      .maybeSingle();

    if (customerError && customerError.code !== "PGRST116") {
      throw customerError;
    }

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found.",
        },
        { status: 404 }
      );
    }

    const { data: documents, error: documentsError } = await supabase
      .from("customer_documents")
      .select("file_path")
      .eq("customer_username", username);

    if (documentsError) {
      throw documentsError;
    }

    const filePaths = Array.isArray(documents)
      ? [...new Set(documents.map((doc) => doc.file_path).filter(Boolean))]
      : [];

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from("documents")
        .remove(filePaths);

      if (storageError) {
        console.error("Storage deletion failed:", storageError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete customer documents from storage.",
          },
          { status: 500 }
        );
      }
    }

    const { error: deleteDocsError } = await supabase
      .from("customer_documents")
      .delete()
      .eq("customer_username", username);

    if (deleteDocsError) {
      throw deleteDocsError;
    }

    if (customer.auth_user_id) {
      try {
        await deleteSupabaseAuthUser(customer.auth_user_id);
      } catch (authError) {
        console.error("Auth deletion failed:", authError);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete authentication account.",
          },
          { status: 500 }
        );
      }
    }

    const { error: deleteCustomerError } = await supabase
      .from("customers")
      .delete()
      .eq("username", username);

    if (deleteCustomerError) {
      throw deleteCustomerError;
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Customer deletion could not be completed.",
      },
      { status: 500 }
    );
  }
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
    const relationshipManagerEmail =
      typeof body_typed.relationship_manager_email === "string"
        ? body_typed.relationship_manager_email.trim() || null
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
      // Sanitize error logging - do not log sensitive auth error details
      const errorInfo = authError as { code?: string; message?: string } | null;
      console.error("Auth user creation failed:", {
        code: errorInfo?.code ?? "UNKNOWN",
        message: errorInfo?.message ?? "Unknown error",
      });
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create authentication account.",
        },
        { status: 500 }
      );
    }

    // 5. Create customers row (WITHOUT password - Supabase Auth is the authority)
    const { data: newCustomer, error: insertError } =
      await supabase
        .from("customers")
        .insert({
          username,
          full_name: fullName,
          email,
          company,
          phone,
          loan_amount: loanAmount,
          product: product,
          application_status: applicationStatus,
          relationship_manager: relationshipManager,
          relationship_manager_email: relationshipManagerEmail,
          relationship_manager_phone: relationshipManagerPhone,
          expected_approval_date: expectedApprovalDate,
          progress: progress,
          auth_user_id: authUserId,
        })
        .select(
          "id, username, full_name, email, company, phone, relationship_manager, relationship_manager_email, relationship_manager_phone, auth_user_id"
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
    // Send welcome email after successful customer creation.
    // Email failure must not rollback the successfully created customer.
    const portalUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://verdyra-capital.vercel.app/portal";

    let welcomeEmailSent = true;

    try {
      const emailResult = await sendWelcomeEmail(
        email,
        fullName,
        username,
        password,
        portalUrl
      );

      welcomeEmailSent = emailResult.success;

      if (!emailResult.success) {
        console.error("Welcome email failed:", {
          username,
          email,
          error: emailResult.error,
        });
      }
    } catch (emailError) {
      welcomeEmailSent = false;

      console.error("Welcome email exception:", {
        username,
        email,
        message:
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
      });
    }

    return NextResponse.json({
      success: true,
      message: welcomeEmailSent
  ? "Merchant created successfully and welcome email sent."
  : "Merchant created successfully, but the welcome email could not be sent.",
      customer: toSafeCustomer({
        id: newCustomer.id,
        username: newCustomer.username,
        full_name: newCustomer.full_name,
        email: newCustomer.email,
        company: newCustomer.company,
        phone: newCustomer.phone,
        date_of_birth: null,
        relationship_manager: newCustomer.relationship_manager,
        relationship_manager_email: newCustomer.relationship_manager_email,
        relationship_manager_phone: newCustomer.relationship_manager_phone,
        auth_user_id: newCustomer.auth_user_id,
        account_status: 'active',
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
