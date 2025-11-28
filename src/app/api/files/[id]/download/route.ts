import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session to verify user is authenticated
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch file from database
    const [file] = await db.select().from(files).where(eq(files.id, id));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Verify the user owns the file or has access (basic check)
    if (file.uploaded_by !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate presigned URL for download from R2
    const downloadUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: file.key,
      }),
      { expiresIn: 60 * 30 } // 30 minutes expiry
    );

    // Return presigned URL or redirect to it
    // Option 1: Return JSON with URL (frontend can use it for download link)
    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error("File download error:", err);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 }
    );
  }
}

// Alternative: POST route that streams the file directly (less common but option)
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get session to verify user is authenticated
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch file from database
    const [file] = await db.select().from(files).where(eq(files.id, id));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Verify the user owns the file
    if (file.uploaded_by !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate presigned GET URL
    const downloadUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: file.key,
      }),
      { expiresIn: 60 * 30 }
    );

    // Fetch file from R2
    const res = await fetch(downloadUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch file from R2");
    }

    const arrayBuffer = await res.arrayBuffer();

    // Return file as response with appropriate headers
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": file.mime_type,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
        "Content-Length": file.size.toString(),
      },
    });
  } catch (err: any) {
    console.error("File download error:", err);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 }
    );
  }
}
