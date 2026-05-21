import { ragConfig } from "@/lib/rag/config"
import type { ExtractedPage } from "@/lib/rag/pdf"

export type ChunkInput = {
  pageNumber: number
  chunkIndex: number
  text: string
}

export function chunkPages(pages: ExtractedPage[]) {
  const chunks: ChunkInput[] = []
  const chunkSize = Math.max(200, ragConfig.chunkSizeChars)
  const overlap = Math.min(Math.max(0, ragConfig.chunkOverlapChars), chunkSize - 1)

  for (const page of pages) {
    for (const text of splitText(page.text, chunkSize, overlap)) {
      chunks.push({
        pageNumber: page.pageNumber,
        chunkIndex: chunks.length,
        text,
      })
    }
  }

  return chunks
}

function splitText(text: string, chunkSize: number, overlap: number) {
  const normalized = text.trim()

  if (!normalized) {
    return []
  }

  const chunks: string[] = []
  let start = 0

  while (start < normalized.length) {
    const hardEnd = Math.min(start + chunkSize, normalized.length)
    const end = findSoftBoundary(normalized, start, hardEnd)
    const chunk = normalized.slice(start, end).trim()

    if (chunk) {
      chunks.push(chunk)
    }

    if (end >= normalized.length) {
      break
    }

    start = Math.max(0, end - overlap)
  }

  return chunks
}

function findSoftBoundary(text: string, start: number, hardEnd: number) {
  if (hardEnd >= text.length) {
    return hardEnd
  }

  const lastPeriod = text.lastIndexOf(".", hardEnd)
  const lastSpace = text.lastIndexOf(" ", hardEnd)
  const softEnd = Math.max(lastPeriod, lastSpace)

  return softEnd > start + 200 ? softEnd + (text[softEnd] === "." ? 1 : 0) : hardEnd
}
