import { prisma } from "@/lib/prisma"
import { chunkPages } from "@/lib/rag/chunking"
import { ragConfig } from "@/lib/rag/config"
import { embedTexts } from "@/lib/rag/embedding"
import { RagError } from "@/lib/rag/errors"
import { extractPdfPages, validatePdfUpload } from "@/lib/rag/pdf"
import type { DocumentSummary, IndexingStatus } from "@/types/rag"

export async function ingestDocument(file: File) {
  const upload = await validatePdfUpload(file)
  const document = await prisma.document.create({
    data: {
      originalFilename: upload.originalFilename,
      contentType: upload.contentType,
      fileSizeBytes: upload.fileSizeBytes,
      pdfBlob: new Uint8Array(upload.buffer),
      sha256: upload.sha256,
      indexingStatus: "pending",
    },
  })

  try {
    const pages = await extractPdfPages(upload.buffer)
    const chunks = chunkPages(pages)

    if (chunks.length === 0) {
      throw new RagError("DOCUMENT_NO_TEXT", "The PDF does not contain extractable text.", 422)
    }

    const embeddings = await embedTexts(chunks.map((chunk) => chunk.text))

    await prisma.$transaction([
      prisma.documentChunk.createMany({
        data: chunks.map((chunk, index) => {
          const embedding = embeddings[index]

          if (!embedding) {
            throw new RagError("OPENAI_REQUEST_FAILED", "OpenAI embedding response was incomplete.", 502)
          }

          return {
            documentId: document.id,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            embedding: JSON.stringify(embedding),
            embeddingModel: ragConfig.embeddingModel,
          }
        }),
      }),
      prisma.document.update({
        where: {
          id: document.id,
        },
        data: {
          pageCount: pages.length,
          chunkCount: chunks.length,
          indexingStatus: "indexed",
          errorMessage: null,
        },
      }),
    ])

    const indexed = await prisma.document.findUniqueOrThrow({
      where: {
        id: document.id,
      },
    })

    return toDocumentSummary(indexed)
  } catch (error) {
    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        indexingStatus: "failed",
        errorMessage: error instanceof Error ? error.message : "Document indexing failed.",
      },
    })

    throw error
  }
}

export async function listDocuments() {
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return documents.map(toDocumentSummary)
}

export async function deleteDocument(documentId: string) {
  try {
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    })
  } catch {
    throw new RagError("DOCUMENT_NOT_FOUND", "Document was not found.", 404)
  }
}

type PersistedDocument = {
  id: string
  originalFilename: string
  contentType: string
  fileSizeBytes: number
  sha256: string
  pageCount: number
  chunkCount: number
  indexingStatus: string
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
}

function toDocumentSummary(document: PersistedDocument): DocumentSummary {
  return {
    id: document.id,
    originalFilename: document.originalFilename,
    contentType: document.contentType,
    fileSizeBytes: document.fileSizeBytes,
    sha256: document.sha256,
    pageCount: document.pageCount,
    chunkCount: document.chunkCount,
    indexingStatus: normalizeStatus(document.indexingStatus),
    errorMessage: document.errorMessage,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  }
}

function normalizeStatus(status: string): IndexingStatus {
  if (status === "indexed" || status === "failed" || status === "pending") {
    return status
  }

  return "failed"
}
