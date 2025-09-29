import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function parsePdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString('base64'),
                mimeType: 'application/pdf'
              }
            },
            {
              text: "Extract all text content from this PDF document. Return only the extracted text without any commentary."
            }
          ]
        }
      ]
    });
    
    return response.text || "No content extracted from PDF";
  } catch (error) {
    console.error("PDF parse error:", error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function summarizePdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString('base64'),
                mimeType: 'application/pdf'
              }
            },
            {
              text: "Summarize this PDF document in 3-5 key points. Focus on the main topics, conclusions, and important information."
            }
          ]
        }
      ]
    });
    
    return response.text || "No summary available for PDF";
  } catch (error) {
    console.error("PDF summarization error:", error);
    throw new Error(`Failed to summarize PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}



export async function parseDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function parseText(arrayBuffer: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("utf-8");
}

export function getSupportedFileTypes() {
  return ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
}

export function getFileTypeCategory(mimeType: string) {
  if (mimeType === "application/pdf" || mimeType.startsWith("text/") || mimeType.includes("wordprocessingml")) {
    return "document";
  }
  if (mimeType.startsWith("image/")) {
    return "image";
  }
  return "unknown";
}