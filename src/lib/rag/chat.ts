import { ragConfig } from "@/lib/rag/config"
import { RagError } from "@/lib/rag/errors"
import { getOpenAIClient } from "@/lib/rag/openai"
import { retrieveRelevantChunks, toCitation } from "@/lib/rag/retrieval"
import type { ChatResponse } from "@/types/rag"

export async function answerQuestion(question: string): Promise<ChatResponse> {
  const results = await retrieveRelevantChunks(question)

  if (results.length === 0) {
    throw new RagError("CHAT_NO_CONTEXT", "The uploaded PDFs do not contain enough information to answer that question.", 404)
  }

  const context = results
    .map(
      (result, index) =>
        `[${index + 1}] ${result.filename}, page ${result.pageNumber}, chunk ${result.chunkIndex}\n${result.text}`,
    )
    .join("\n\n")

  try {
    const response = await getOpenAIClient().responses.create({
      model: ragConfig.chatModel,
      instructions:
        "Answer using only the supplied PDF context. If the context is insufficient, say the uploaded PDFs do not contain enough information. Include citations like [1] for factual claims.",
      input: `Question:\n${question}\n\nPDF context:\n${context}`,
      max_output_tokens: 700,
    })

    return {
      answer: response.output_text.trim() || "The uploaded PDFs do not contain enough information to answer that question.",
      citations: results.map(toCitation),
    }
  } catch (error) {
    console.error(error)
    throw new RagError("OPENAI_REQUEST_FAILED", "OpenAI answer generation failed.", 502)
  }
}
