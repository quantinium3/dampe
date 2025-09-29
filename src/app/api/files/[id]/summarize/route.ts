import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { summarizePdf } from "@/lib/file-parsers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [file] = await db.select().from(files).where(eq(files.id, id));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.mime_type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files supported" }, { status: 400 });
    }

    const url = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: file.key,
      }),
      { expiresIn: 60 * 10 }
    );

    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();

    const summary = await summarizePdf(arrayBuffer);

    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    console.error("PDF summarization error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}