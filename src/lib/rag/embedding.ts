import { ragConfig } from "@/lib/rag/config"
import { RagError } from "@/lib/rag/errors"
import { getOpenAIClient } from "@/lib/rag/openai"

const EMBEDDING_BATCH_SIZE = 64

export async function embedTexts(texts: string[]) {
  if (texts.length === 0) {
    return []
  }

  const client = getOpenAIClient()
  const embeddings: number[][] = []

  try {
    for (let index = 0; index < texts.length; index += EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(index, index + EMBEDDING_BATCH_SIZE)
      const response = await client.embeddings.create({
        model: ragConfig.embeddingModel,
        input: batch,
        encoding_format: "float",
      })

      for (const item of response.data.sort((a, b) => a.index - b.index)) {
        embeddings.push(item.embedding)
      }
    }
  } catch (error) {
    console.error(error)
    throw new RagError("OPENAI_REQUEST_FAILED", "OpenAI embedding request failed.", 502)
  }

  return embeddings
}

export async function embedText(text: string) {
  const [embedding] = await embedTexts([text])

  if (!embedding) {
    throw new RagError("OPENAI_REQUEST_FAILED", "OpenAI embedding request returned no result.", 502)
  }

  return embedding
}
