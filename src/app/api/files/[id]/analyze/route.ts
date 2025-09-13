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


import { pipeline } from '@xenova/transformers';

let summarizer: any = null;
let classifier: any = null;

async function getSummarizer() {
  if (!summarizer) {
    try {
      console.log('Loading summarization model...');
      summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      console.log('Summarization model loaded');
    } catch (error) {
      console.log('Failed to load summarization model, using fallback');
      return null;
    }
  }
  return summarizer;
}

async function getClassifier() {
  if (!classifier) {
    try {
      console.log('Loading classification model...');
      classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      console.log('Classification model loaded');
    } catch (error) {
      console.log('Failed to load classification model, using fallback');
      return null;
    }
  }
  return classifier;
}

function createFallbackSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.slice(0, 5).join('. ').trim() + '.';
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const frequency: { [key: string]: number } = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

async function extractText(buffer: Buffer, mime: string) {
  console.log(`Extracting text from file type: ${mime}`);

  if (mime === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const data = await pdfParse(buffer);
      console.log(`PDF text length: ${data.text.length}`);
      return data.text;
    } catch (error) {
      console.log('PDF extraction failed:', error);
      try {
        const { default: pdfParseDefault } = await import("pdf-parse");
        const data = await pdfParseDefault(buffer);
        console.log(`PDF text length (fallback): ${data.text.length}`);
        return data.text;
      } catch (fallbackError) {
        console.log('PDF fallback also failed:', fallbackError);
        return `PDF file appears to be corrupted or invalid. Unable to extract text content.`;
      }
    }
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
      let clean, parsed;
      try {
        clean = aiOutput.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
        metadata = parsed;
      } catch (err) {
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

      const summarizer = await getSummarizer();
      const classifier = await getClassifier();
      
      let summary: string;
      let sentiment: string = 'neutral';
      
      if (summarizer) {
        try {
          const summaryResult = await summarizer(text.slice(0, 5000), {
            max_length: 500,
            min_length: 150,
            do_sample: false
          });
          summary = Array.isArray(summaryResult) ? summaryResult[0].summary_text : summaryResult.summary_text;
        } catch (error) {
          console.log('Summarization failed, using fallback');
          summary = createFallbackSummary(text);
        }
      } else {
        summary = createFallbackSummary(text);
      }
      
      if (classifier) {
        try {
          const sentimentResult = await classifier(text.slice(0, 500));
          sentiment = Array.isArray(sentimentResult) ? sentimentResult[0].label.toLowerCase() : sentimentResult.label.toLowerCase();
          sentiment = sentiment === 'positive' ? 'positive' : sentiment === 'negative' ? 'negative' : 'neutral';
        } catch (error) {
          console.log('Sentiment analysis failed, using neutral');
          sentiment = 'neutral';
        }
      }
      
      const keywords = extractKeywords(text);
      
      metadata = {
        summary,
        keywords,
        topics: keywords.slice(0, 3),
        wordCount: text.split(' ').length,
        contentType: 'document',
        language: 'english',
        sentiment,
        category: 'other'
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
