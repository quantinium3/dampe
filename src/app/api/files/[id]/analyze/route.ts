import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import mammoth from "mammoth";
import { summarizer } from "@/lib/utils/summarizer";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });


async function extractText(buffer: Buffer, mime: string) {
  console.log(`Extracting text from file type: ${mime}`);

  if (mime === "application/pdf") {
    const pdf = (await import("pdf-parse")).default;
    const data = await pdf(buffer);
    console.log(`PDF text length: ${data.text.length}`);
    return data.text;
  }
  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      console.log(`DOCX text length: ${result.value.length}`);
      return result.value;
    } catch (error) {
      console.log('DOCX extraction failed:', error);
      return `DOCX file appears to be corrupted or invalid. Unable to extract text content.`;
    }
  }
  if (mime.startsWith("text/")) {
    const text = buffer.toString("utf-8");
    console.log(`Text file length: ${text.length}`);
    return text;
  }
  if (mime.startsWith("image/")) {
    return `This is an image file (${mime}). Image analysis not yet supported.`;
  }

  console.log(`Unsupported file type: ${mime}`);
  return `File type ${mime} - content extraction not supported, but file exists.`;
}

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

    const url = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: file.key,
      }),
      { expiresIn: 60 * 10 }
    );

    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    let aiOutput = "";
    let metadata: any;

    if (file.mime_type.startsWith("image/")) {
      // Vision analysis using image URL (presigned URL)
      const completion = await client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze the image and respond only with valid JSON. No backticks, no prose." },
              { type: "text", text: `JSON schema:\n{\n  "caption": "one sentence caption",\n  "labels": ["label1", "label2", "label3"],\n  "detectedText": "OCR extracted text if any",\n  "dominantColors": ["#RRGGBB", "#RRGGBB"],\n  "safety": "safe|nsfw|graphic|unknown"\n}` },
              { type: "image_url", image_url: { url } },
            ],
          },
        ],
        temperature: 0.2,
      });
      aiOutput = completion.choices[0].message?.content ?? "";
      try {
        const clean = aiOutput.replace(/```json|```/g, "").trim();
        metadata = JSON.parse(clean);
      } catch {
        metadata = {
          caption: aiOutput.slice(0, 200) + "...",
          labels: ["image", file.mime_type.split("/")[1] ?? "unknown"],
        };
      }

    } else {
      const text = await extractText(buffer, file.mime_type);
      if (!text.trim()) {
        return NextResponse.json({ error: "No text extracted" }, { status: 400 });
      }

      // Use local summarizer
      let summaryObj: any = {};
      try {
        summaryObj = await summarizer.summarize(text, { sentences: 10 });
      } catch (err) {
        summaryObj.summary = text.slice(0, 1000) + "...";
      }

      const keywords = Array.from(
        new Set(
          (summaryObj.summary || "")
            .split(/\W+/)
            .filter((w: string) => w.length > 5)
            .slice(0, 5)
        )
      );

      metadata = {
        summary: summaryObj.summary,
        keywords,
        topics: ["General content"],
        wordCount: text.split(" ").length,
      };
    }

    console.log('AI raw output:', aiOutput);

    await db
      .update(files)
      .set({
        ai_metadata: metadata,
        ai_analyzed: true,
        updated_at: new Date(),
      })
      .where(eq(files.id, id));

    return NextResponse.json({ success: true, metadata });
  } catch (err: any) {
    console.error("AI analyze error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
