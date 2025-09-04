import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema/file-schema";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import mammoth from "mammoth";
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

    const text = await extractText(buffer, file.mime_type);
    if (!text.trim()) {
      return NextResponse.json({ error: "No text extracted" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Analyze the following text and respond only with valid JSON. No backticks, no explanations.

Text to analyze:
${text.slice(0, 100000)}

JSON schema:
{
  "summary": "Brief summary in atleast 4000 characters",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "topics": ["main topic 1", "main topic 2", "main topic 3"],
  "contentType": "document|report|article|letter|manual|other",
  "language": "detected language",
  "wordCount": ${text.split(' ').length},
  "sentiment": "positive|negative|neutral",
  "category": "business|academic|personal|technical|legal|other"
}`
        },
      ],
      temperature: 0.3,
    });

    const aiOutput = completion.choices[0].message?.content ?? "";
    console.log('AI raw output:', aiOutput);

    let metadata;
    try {
      const clean = aiOutput.replace(/```json|```/g, "").trim();
      metadata = JSON.parse(clean);
    } catch (error) {
      console.log('JSON parse failed, creating fallback metadata');
      metadata = {
        summary: aiOutput.slice(0, 200) + '...',
        keywords: ['analysis', 'document'],
        topics: ['General content'],
        wordCount: text.split(' ').length
      };
    }

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
