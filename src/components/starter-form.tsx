"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactInput } from "@/lib/validators"

export function StarterForm() {
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactInput) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const data = (await response.json()) as {
      message?: string
      error?: string
      submission?: { id: string }
    }

    if (!response.ok) {
      toast.error(data.error ?? "Something went wrong.")
      return
    }

    setSubmissionId(data.submission?.id ?? null)
    toast.success(data.message ?? "Saved successfully.")
    reset()
  }

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Database-backed form</CardTitle>
        <CardDescription>
          Submissions are validated with Zod, handled by a route handler, and stored in Prisma.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" {...register("name")} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell me what you want to build."
              className="min-h-28"
              {...register("message")}
            />
            {errors.message ? <p className="text-sm text-destructive">{errors.message.message}</p> : null}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {submissionId ? `Last saved submission: ${submissionId}` : "Ready to validate and save."}
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

