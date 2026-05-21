import { NextResponse } from "next/server"

import type { ApiErrorResponse } from "@/types/rag"

export class RagError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message)
    this.name = "RagError"
  }
}

export function jsonError(error: unknown) {
  if (error instanceof RagError) {
    return NextResponse.json<ApiErrorResponse>(
      {
        code: error.code,
        message: error.message,
      },
      { status: error.status },
    )
  }

  console.error(error)

  return NextResponse.json<ApiErrorResponse>(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong while processing the request.",
    },
    { status: 500 },
  )
}
