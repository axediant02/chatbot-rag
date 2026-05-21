import { NextResponse } from "next/server"

import { deleteDocument } from "@/lib/rag/documents"
import { jsonError } from "@/lib/rag/errors"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{
    documentId: string
  }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { documentId } = await context.params
    await deleteDocument(documentId)

    return NextResponse.json({
      message: "Document deleted.",
    })
  } catch (error) {
    return jsonError(error)
  }
}
