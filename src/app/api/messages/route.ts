import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validators"

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    )
  }

  const parsed = contactSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid submission.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const submission = await prisma.contactSubmission.create({
    data: parsed.data,
  })

  return NextResponse.json(
    {
      message: "Submission saved to the local database.",
      submission: {
        id: submission.id,
        createdAt: submission.createdAt.toISOString(),
      },
    },
    { status: 201 },
  )
}
