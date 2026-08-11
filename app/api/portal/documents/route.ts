import { NextResponse } from "next/server";

import { requireCustomer } from "@/lib/server/customerAuth.server";
import { createSupabaseServiceRoleClient } from "@/lib/server/supabase.server";

const BUCKET = "documents";

export async function GET() {
  try {
    const customer = await requireCustomer();
    const supabase = createSupabaseServiceRoleClient();

    const { data, error } = await supabase
      .from("customer_documents")
      .select("*")
      .eq("customer_username", customer.username)
      .order("uploaded_at", {
        ascending: false,
      });

    if (error) {
      console.error("Customer documents fetch failed:", error);

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
      documents: data ?? [],
    });
  } catch (error) {
    console.error("Customer documents GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Customer authentication required.",
      },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const customer = await requireCustomer();
    const formData = await request.formData();

    const documentType = formData.get("document_type");
    const file = formData.get("file");

    if (
      typeof documentType !== "string" ||
      !documentType.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Document type is required.",
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "A document file is required.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum file size is 10 MB.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "bin";

    const timestamp = Date.now();
    const random = Math.random()
      .toString(36)
      .substring(2, 8);

    const fileName = `${documentType}_${timestamp}_${random}.${extension}`;

    // The username comes ONLY from the authenticated
    // customer session. It is never accepted from the browser.
    const storagePath = `${customer.username}/${fileName}`;

    const supabase = createSupabaseServiceRoleClient();

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          upsert: false,
          contentType: file.type || undefined,
        });

    if (uploadError) {
      console.error(
        "Customer document storage upload failed:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload document.",
        },
        { status: 500 }
      );
    }

    const { data, error: dbError } = await supabase
      .from("customer_documents")
      .insert({
        customer_username: customer.username,
        document_type: documentType,
        file_name: file.name,
        file_path: storagePath,
        status: "Pending",
        uploaded_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null,
        remarks: null,
      })
      .select()
      .single();

    if (dbError) {
      console.error(
        "Customer document DB insert failed:",
        dbError
      );

      // Roll back the storage upload if the DB insert fails.
      await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to save document.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document: data,
    });
  } catch (error) {
    console.error("Customer documents POST failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Customer authentication required.",
      },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const customer = await requireCustomer();
    const body = await request.json();

    const documentId =
      typeof body.document_id === "string"
        ? body.document_id
        : "";

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
          message: "Failed to find document.",
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

    // Ownership check.
    if (
      document.customer_username !==
      customer.username
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to delete this document.",
        },
        { status: 403 }
      );
    }

    const { error: storageError } =
      await supabase.storage
        .from(BUCKET)
        .remove([document.file_path]);

    if (storageError) {
      console.error(
        "Customer document storage delete failed:",
        storageError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete document file.",
        },
        { status: 500 }
      );
    }

    const { error: deleteError } = await supabase
      .from("customer_documents")
      .delete()
      .eq("id", document.id);

    if (deleteError) {
      console.error(
        "Customer document DB delete failed:",
        deleteError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete document.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Customer documents DELETE failed:",
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