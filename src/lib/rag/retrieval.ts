import { prisma } from "@/lib/prisma"
import { ragConfig } from "@/lib/rag/config"
import { embedText } from "@/lib/rag/embedding"
import { RagError } from "@/lib/rag/errors"
import type { Citation } from "@/types/rag"

export type RetrievalResult = {
  chunkId: string
  documentId: string
  filename: string
  pageNumber: number
  chunkIndex: number
  text: string
  score: number
}

export async function retrieveRelevantChunks(question: string) {
  const chunks = await prisma.documentChunk.findMany({
    where: {
      document: {
        indexingStatus: "indexed",
      },
    },
    include: {
      document: {
        select: {
          id: true,
          originalFilename: true,
        },
      },
    },
  })

  if (chunks.length === 0) {
    return []
  }

  const queryEmbedding = await embedText(question)

  const ranked = chunks
    .map((chunk) => {
      const embedding = parseEmbedding(chunk.embedding)

      return {
        chunkId: chunk.id,
        documentId: chunk.document.id,
        filename: chunk.document.originalFilename,
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        score: cosineSimilarity(queryEmbedding, embedding),
      }
    })
    .filter((chunk) => Number.isFinite(chunk.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, ragConfig.retrievalTopK)

  return ranked
}

export function toCitation(result: RetrievalResult): Citation {
  return {
    documentId: result.documentId,
    chunkId: result.chunkId,
    filename: result.filename,
    pageNumber: result.pageNumber,
    chunkIndex: result.chunkIndex,
  }
}

export function cosineSimilarity(left: number[], right: number[]) {
  if (left.length !== right.length || left.length === 0) {
    return Number.NaN
  }

  let dotProduct = 0
  let leftMagnitude = 0
  let rightMagnitude = 0

  for (let index = 0; index < left.length; index += 1) {
    const leftValue = left[index] ?? 0
    const rightValue = right[index] ?? 0
    dotProduct += leftValue * rightValue
    leftMagnitude += leftValue * leftValue
    rightMagnitude += rightValue * rightValue
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return Number.NaN
  }

  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude))
}

function parseEmbedding(value: string) {
  const parsed = JSON.parse(value) as unknown

  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "number")) {
    throw new RagError("DATABASE_UNAVAILABLE", "Stored embedding data is invalid.", 500)
  }

  return parsed
}
