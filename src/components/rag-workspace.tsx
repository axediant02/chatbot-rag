"use client"

import { FormEvent, useState } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Database, FileText, Loader2, MessageSquare, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ApiErrorResponse, ChatResponse, DocumentSummary } from "@/types/rag"

type DocumentsResponse = {
  documents: DocumentSummary[]
}

type UploadResponse = {
  message: string
  document: DocumentSummary
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ApiErrorResponse

  if (!response.ok) {
    const error = data as ApiErrorResponse
    throw new Error(error.message ?? "Request failed.")
  }

  return data as T
}

async function fetchDocuments() {
  const response = await fetch("/api/admin/documents", {
    cache: "no-store",
  })

  return parseResponse<DocumentsResponse>(response)
}

export function RagWorkspace() {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null)

  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
  })

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("Choose a PDF file first.")
      }

      const body = new FormData()
      body.append("file", file)

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body,
      })

      return parseResponse<UploadResponse>(response)
    },
    onSuccess: async (data) => {
      setFile(null)
      toast.success(data.message)
      await queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: "DELETE",
      })

      return parseResponse<{ message: string }>(response)
    },
    onSuccess: async (data) => {
      toast.success(data.message)
      await queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const chatMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      })

      return parseResponse<ChatResponse>(response)
    },
    onSuccess: (data) => {
      setChatResponse(data)
    },
    onError: (error) => {
      setChatResponse(null)
      toast.error(error.message)
    },
  })

  const documents = documentsQuery.data?.documents ?? []

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    uploadMutation.mutate()
  }

  function handleQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    chatMutation.mutate()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="grid gap-6">
        <Card className="border-slate-200/70 bg-white/85 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600">Admin</Badge>
              <Badge variant="outline" className="rounded-full">
                Database-backed PDFs
              </Badge>
            </div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Upload className="size-5" />
              Upload PDFs
            </CardTitle>
            <CardDescription>
              Text-based PDFs are stored in SQLite, chunked, embedded, and made available for grounded chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleUpload}>
              <div className="grid gap-2">
                <Label htmlFor="pdf">PDF file</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <Button type="submit" disabled={!file || uploadMutation.isPending}>
                {uploadMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Upload and index
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="size-5" />
              Indexed documents
            </CardTitle>
            <CardDescription>Manage PDFs stored in the local application database.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {documentsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-muted-foreground">
                No PDFs indexed yet.
              </p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium">{document.originalFilename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(document.fileSizeBytes)} · {document.pageCount} pages · {document.chunkCount} chunks
                      </p>
                    </div>
                    <Badge variant={document.indexingStatus === "indexed" ? "secondary" : "outline"}>
                      {document.indexingStatus}
                    </Badge>
                  </div>
                  {document.errorMessage ? <p className="text-sm text-destructive">{document.errorMessage}</p> : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-self-start"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(document.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card className="border-slate-200/70 bg-white/90 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="size-5" />
              Ask the PDFs
            </CardTitle>
            <CardDescription>
              Questions are answered only from retrieved chunks. If the PDFs do not contain enough context, the app will say so.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleQuestion}>
              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What does the uploaded material say about..."
                  className="min-h-32"
                />
              </div>
              <Button type="submit" disabled={!question.trim() || chatMutation.isPending}>
                {chatMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
                Ask question
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="min-h-80 border-slate-200/70 bg-slate-950 text-slate-50 shadow-[0_24px_90px_rgba(15,23,42,0.16)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="size-5" />
              Grounded answer
            </CardTitle>
            <CardDescription className="text-slate-300">Answer text and source citations appear here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {chatResponse ? (
              <>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100">{chatResponse.answer}</p>
                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Citations</p>
                  {chatResponse.citations.map((citation) => (
                    <div key={citation.chunkId} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                      {citation.filename}, page {citation.pageNumber}, chunk {citation.chunkIndex}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300">
                Upload and index at least one text-based PDF, then ask a question. The answer will be constrained to retrieved PDF context.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
