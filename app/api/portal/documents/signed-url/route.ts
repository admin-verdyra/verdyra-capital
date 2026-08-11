import { NextResponse } from "next/server";

import { requireCustomer } from "@/lib/server/customerAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";

const BUCKET = "documents";

export async function GET(request: Request) {
  try {
    const customer = await requireCustomer();

    const { searchParams } = new URL(request.url);
    const documentId = searchParams
      .get("document_id")
      ?.trim();

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase =
      createSupabaseServiceRoleClient();

    // Fetch the document server-side.
    const { data: document, error: documentError } =
      await supabase
        .from("customer_documents")
        .select(
          "id, customer_username, file_path"
        )
        .eq("id", documentId)
        .maybeSingle();

    if (documentError) {
      console.error(
        "Customer document lookup failed:",
        documentError
      );

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

    // SECURITY:
    // A customer can only preview their own documents.
    if (
      document.customer_username !==
      customer.username
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    // Generate the signed URL using the server-side
    // service-role client.
    const {
      data: signedUrlData,
      error: signedUrlError,
    } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        document.file_path,
        60 * 30
      );

    if (signedUrlError) {
      console.error(
        "Customer signed URL generation failed:",
        signedUrlError
      );

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
    console.error(
      "Customer signed URL request failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Customer authentication required.",
      },
      { status: 401 }
    );
  }
}
