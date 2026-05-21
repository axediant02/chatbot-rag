import { createHash } from "node:crypto"

import { PDFParse } from "pdf-parse"

import { ragConfig } from "@/lib/rag/config"
import { RagError } from "@/lib/rag/errors"

export type ExtractedPage = {
  pageNumber: number
  text: string
}

export type ValidatedPdfUpload = {
  buffer: Buffer
  contentType: string
  fileSizeBytes: number
  originalFilename: string
  sha256: string
}

export function sanitizeFilename(filename: string) {
  const withoutPath = filename.split(/[\\/]/).pop() ?? "document.pdf"
  const cleaned = withoutPath
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[^\w.\- ()]/g, "_")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned || "document.pdf"
}

function hasPdfMagicBytes(buffer: Buffer) {
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-"
}

export async function validatePdfUpload(file: File): Promise<ValidatedPdfUpload> {
  const originalFilename = sanitizeFilename(file.name)

  if (!originalFilename.toLowerCase().endsWith(".pdf")) {
    throw new RagError("DOCUMENT_INVALID_TYPE", "Only PDF files are supported.", 415)
  }

  if (file.size <= 0) {
    throw new RagError("DOCUMENT_EMPTY", "The uploaded PDF is empty.", 400)
  }

  if (file.size > ragConfig.maxUploadBytes) {
    throw new RagError("DOCUMENT_TOO_LARGE", "The uploaded PDF exceeds the configured size limit.", 413)
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (!hasPdfMagicBytes(buffer)) {
    throw new RagError("DOCUMENT_INVALID_TYPE", "The uploaded file is not a valid PDF.", 415)
  }

  return {
    buffer,
    contentType: file.type || "application/pdf",
    fileSizeBytes: buffer.byteLength,
    originalFilename,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  }
}

export async function extractPdfPages(buffer: Buffer): Promise<ExtractedPage[]> {
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  })

  try {
    const result = await parser.getText()
    const pages = result.pages.map((page, index) => ({
      pageNumber: page.num || index + 1,
      text: normalizeText(page.text),
    }))

    if (!pages.some((page) => page.text.length > 0)) {
      throw new RagError("DOCUMENT_NO_TEXT", "The PDF does not contain extractable text.", 422)
    }

    return pages
  } finally {
    await parser.destroy()
  }
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}
