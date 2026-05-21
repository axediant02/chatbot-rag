import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export type ContactInput = z.infer<typeof contactSchema>

export const chatQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question is required.").max(2000, "Question is too long."),
})

export type ChatQuestionInput = z.infer<typeof chatQuestionSchema>
