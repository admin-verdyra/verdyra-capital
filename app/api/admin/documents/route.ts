import { NextResponse } from "next/server";

import { requireAdmin, isSuperAdmin, canAccessMerchant } from "@/lib/server/adminAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";

export async function GET(request: Request) {
  try {
    // 1. Verify authenticated admin
    let admin;
    try {
      admin = await requireAdmin();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    const superAdmin = isSuperAdmin(admin);

    // 2. Get username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toString().trim();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    // 3. Find the customer by username to get created_by_admin_id
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id, username, created_by_admin_id")
      .eq("username", username)
      .maybeSingle();

    if (customerError && customerError.code !== "PGRST116") {
      console.error("Customer lookup failed:", customerError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch customer.",
        },
        { status: 500 }
      );
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

    // 4. Authorization check
    if (!superAdmin) {
      if (!canAccessMerchant(admin, customer.created_by_admin_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden: You can only access documents for merchants you created.",
          },
          { status: 403 }
        );
      }
    }

    // 5. Query customer_documents for that username
    const { data: documents, error: docsError } = await supabase
      .from("customer_documents")
      .select("*")
      .eq("customer_username", username)
      .order("uploaded_at", { ascending: false });

    if (docsError) {
      console.error("Document listing failed:", docsError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch documents.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documents: documents ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Document listing could not be completed.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // 1. Verify authenticated admin
    let admin;
    try {
      admin = await requireAdmin();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 }
      );
    }

    const superAdmin = isSuperAdmin(admin);

    // 2. Parse request body
    const body = await request.json();
    const documentId = body.document_id?.toString().trim();
    const status = body.status;
    const reviewer = body.reviewer?.toString().trim() || "Admin";
    const remarks = body.remarks?.toString().trim() || null;

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
        },
        { status: 400 }
      );
    }

    if (!status || !["Approved", "Rejected", "Re-upload Required"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid status is required (Approved, Rejected, Re-upload Required).",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    // 3. Fetch the target document by document ID to get customer_username
    const { data: document, error: docError } = await supabase
      .from("customer_documents")
      .select("id, customer_username")
      .eq("id", documentId)
      .maybeSingle();

    if (docError && docError.code !== "PGRST116") {
      console.error("Document lookup failed:", docError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch document.",
        },
        { status: 500 }
      );
    }

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        { status: 404 }
      );
    }

    // 4. Fetch the customer to get created_by_admin_id
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id, username, created_by_admin_id")
      .eq("username", document.customer_username)
      .maybeSingle();

    if (customerError && customerError.code !== "PGRST116") {
      console.error("Customer lookup failed:", customerError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch customer.",
        },
        { status: 500 }
      );
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

    // 5. Authorization check
    if (!superAdmin) {
      if (!canAccessMerchant(admin, customer.created_by_admin_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden: You can only review documents for merchants you created.",
          },
          { status: 403 }
        );
      }
    }

    // 6. Update the document
    const { error: updateError } = await supabase
      .from("customer_documents")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewer,
        remarks,
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Document update failed:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update document.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document reviewed successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Document review could not be completed.",
      },
      { status: 500 }
    );
  }
}