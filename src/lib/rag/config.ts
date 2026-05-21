function readInteger(name: string, fallback: number) {
  const value = process.env[name]

  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const ragConfig = {
  maxUploadBytes: readInteger("MAX_UPLOAD_MB", 50) * 1024 * 1024,
  chunkSizeChars: readInteger("CHUNK_SIZE_CHARS", 3200),
  chunkOverlapChars: readInteger("CHUNK_OVERLAP_CHARS", 600),
  retrievalTopK: readInteger("RETRIEVAL_TOP_K", 5),
  chatModel: process.env.OPENAI_CHAT_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
}
