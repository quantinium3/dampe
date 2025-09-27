import mammoth from "mammoth";

export async function parsePdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log("parsePdf input check:", typeof arrayBuffer);

    const pdfParse = (await import("pdf-parse")).default;

    if (typeof arrayBuffer === "string") {
      throw new Error(`parsePdf received a string path instead of ArrayBuffer`);
    }

    const buffer = Buffer.isBuffer(arrayBuffer)
      ? arrayBuffer
      : Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF parse error:", error);

    const buffer = Buffer.isBuffer(arrayBuffer)
      ? arrayBuffer
      : Buffer.from(arrayBuffer);

    const text = buffer.toString("utf8");
    const textMatch = text.match(/BT[\s\S]*?ET/g);
    if (textMatch) {
      return textMatch
        .join(" ")
        .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
        .trim();
    }
    throw error;
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