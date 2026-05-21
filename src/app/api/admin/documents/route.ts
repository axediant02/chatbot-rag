import { NextResponse } from "next/server"

import { ingestDocument, listDocuments } from "@/lib/rag/documents"
import { RagError, jsonError } from "@/lib/rag/errors"

export const runtime = "nodejs"

export async function GET() {
  try {
    const documents = await listDocuments()

    return NextResponse.json({
      documents,
    })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      throw new RagError("DOCUMENT_MISSING_FILE", "Upload must include a PDF file.", 400)
    }

    const document = await ingestDocument(file)

    return NextResponse.json(
      {
        message: "Document uploaded and indexed.",
        document,
      },
      { status: 201 },
    )
  } catch (error) {
    return jsonError(error)
  }
}
