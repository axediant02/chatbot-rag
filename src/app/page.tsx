import { Badge } from "@/components/ui/badge"
import { RagWorkspace } from "@/components/rag-workspace"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#eefdf8_42%,_#fff7ed)] px-6 py-8 text-slate-950 sm:px-10 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <header className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_28px_110px_rgba(15,23,42,0.10)] backdrop-blur md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">Local-first RAG</Badge>
            <Badge variant="outline" className="rounded-full bg-white/60 px-3 py-1">
              Next.js · Prisma · OpenAI
            </Badge>
          </div>
          <div className="mt-6 max-w-4xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Chat with admin-uploaded PDFs stored in your local database.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Upload text-based PDFs, index page-aware chunks with embeddings, and ask grounded questions with citations back to each source page.
            </p>
          </div>
        </header>

        <RagWorkspace />
      </div>
    </main>
  )
}
