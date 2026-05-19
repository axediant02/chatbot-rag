import { ArrowRight, BadgeCheck, Database, Layers3, Sparkles, TerminalSquare } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarterForm } from "@/components/starter-form"
import { SystemStatus } from "@/components/system-status"

const stack = [
  {
    value: "frontend",
    title: "Frontend",
    description:
      "App Router, server components by default, and shadcn/ui primitives for fast product UI.",
    points: [
      "Next.js 16 with TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui components",
    ],
  },
  {
    value: "backend",
    title: "Backend",
    description:
      "Route handlers, schema validation, and server-side data access for real application logic.",
    points: [
      "Route handlers in app/api",
      "Zod validation",
      "React Query client state",
    ],
  },
  {
    value: "data",
    title: "Data",
    description:
      "Prisma with SQLite gives you a local database path immediately, without external setup.",
    points: [
      "Prisma ORM",
      "SQLite dev database",
      "Generated client and scripts",
    ],
  },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff_48%,_#ffffff)] px-6 py-8 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(to_bottom,_#020617,_#0f172a_48%,_#020617)] dark:text-slate-50 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-slate-950/70">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkles className="size-3.5" />
              Full-stack starter
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Next.js + shadcn + Tailwind + Prisma
            </Badge>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                A working Next.js environment for product UI, APIs, and local database work.
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-slate-600 dark:text-slate-300">
                This starter is set up for real development: App Router, shadcn/ui, Tailwind CSS, React Query,
                Zod, React Hook Form, Sonner, and Prisma with SQLite.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button className="rounded-full">
                Start building
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" className="rounded-full">
                View stack
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TerminalSquare className="size-5" />
                  Included foundation
                </CardTitle>
                <CardDescription>
                  The setup is ready for frontend work, backend routes, and local data persistence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="frontend" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {stack.map((item) => (
                      <TabsTrigger key={item.value} value={item.value}>
                        {item.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {stack.map((item) => (
                    <TabsContent key={item.value} value={item.value} className="mt-4">
                      <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/30 p-5">
                        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                        <Separator />
                        <ul className="grid gap-2 text-sm">
                          {item.points.map((point) => (
                            <li key={point} className="flex items-center gap-2">
                              <BadgeCheck className="size-4 text-emerald-600" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers3 className="size-4" />
                    UI primitives
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Card, badge, input, textarea, tabs, separator, and button are ready.
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="size-4" />
                    Local data
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Prisma is configured for SQLite so you can start persisting records immediately.
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4" />
                    Dev ergonomics
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  React Query, Zod, and Sonner give you a solid base for interactive flows.
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6">
            <SystemStatus />
            <StarterForm />
          </div>
        </section>
      </div>
    </main>
  )
}

