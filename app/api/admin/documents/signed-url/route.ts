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

    // 2. Get document_id from query params
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("document_id")?.toString().trim();

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceRoleClient();

    // 3. Fetch the target document by document ID to get customer_username and file_path
    const { data: document, error: docError } = await supabase
      .from("customer_documents")
      .select("id, customer_username, file_path")
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
            message: "Forbidden: You can only access documents for merchants you created.",
          },
          { status: 403 }
        );
      }
    }

    // 6. Generate signed URL using the document's server-fetched file_path
    // NEVER accept file_path from the browser as the authority
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.file_path, 60 * 30);

    if (signedUrlError) {
      console.error("Signed URL generation failed:", signedUrlError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate signed URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signed_url: signedUrlData.signedUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Signed URL generation could not be completed.",
      },
      { status: 500 }
    );
  }
}