import { NextResponse } from "next/server"

import { chatQuestionSchema } from "@/lib/validators"
import { answerQuestion } from "@/lib/rag/chat"
import { RagError, jsonError } from "@/lib/rag/errors"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    let payload: unknown

    try {
      payload = await request.json()
    } catch {
      throw new RagError("INVALID_JSON", "Request body must be valid JSON.", 400)
    }

    const parsed = chatQuestionSchema.safeParse(payload)

    if (!parsed.success) {
      throw new RagError("CHAT_INVALID_REQUEST", parsed.error.issues[0]?.message ?? "Invalid chat request.", 400)
    }

    const response = await answerQuestion(parsed.data.question)

    return NextResponse.json(response)
  } catch (error) {
    return jsonError(error)
  }
}
