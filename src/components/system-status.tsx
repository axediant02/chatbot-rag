"use client"

import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, CircleAlert, Loader2, Server } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type HealthResponse = {
  status: string
  runtime: string
  timestamp: string
}

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health", {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Health check failed")
  }

  return response.json()
}

export function SystemStatus() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  })

  const state = isLoading ? "loading" : isError ? "error" : "healthy"

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Runtime status</CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              "gap-1.5",
              state === "healthy" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
              state === "error" && "bg-rose-500/15 text-rose-700 hover:bg-rose-500/15",
            )}
          >
            {state === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : state === "error" ? (
              <CircleAlert className="size-3.5" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            {state}
          </Badge>
        </div>
        <CardDescription>
          Health checks and API routes are wired up for local development.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Server className="size-4" />
          <span>{data?.runtime ?? "nodejs"}</span>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 font-mono text-xs leading-5 text-muted-foreground">
          {data ? JSON.stringify(data, null, 2) : "Waiting for the API response..."}
        </div>
      </CardContent>
    </Card>
  )
}

