export type IndexingStatus = "pending" | "indexed" | "failed"

export type DocumentSummary = {
  id: string
  originalFilename: string
  contentType: string
  fileSizeBytes: number
  sha256: string
  pageCount: number
  chunkCount: number
  indexingStatus: IndexingStatus
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export type Citation = {
  documentId: string
  chunkId: string
  filename: string
  pageNumber: number
  chunkIndex: number
}

export type ChatResponse = {
  answer: string
  citations: Citation[]
}

export type ApiErrorResponse = {
  code: string
  message: string
}
