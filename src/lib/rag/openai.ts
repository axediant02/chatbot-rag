import OpenAI from "openai"

import { RagError } from "@/lib/rag/errors"

let client: OpenAI | null = null

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new RagError("OPENAI_API_KEY_MISSING", "OpenAI API key is not configured.", 500)
  }

  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  return client
}
