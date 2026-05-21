# Documentation Index

This documentation defines the build contract for the local-first PDF RAG chatbot.

## Documents

- `FEATURE_PLAN.md`: Product scope, requirements, MVP phases, acceptance criteria.
- `ARCHITECTURE.md`: System design, components, APIs, data flow, RAG pipeline, storage, security.
- `CODING_STANDARDS.md`: Next.js, TypeScript, Prisma, testing, API, and error-handling rules.
- `NAMING_CONVENTIONS.md`: Naming rules for files, modules, APIs, types, IDs, config, and RAG data.
- `ENGINEERING_PRACTICES.md`: Workflow, testing discipline, review criteria, security, observability, dependency practices.
- `RESOURCES.md`: Required tools, libraries, environment variables, runtime data, and official references.

## Current Decisions

- Deployment target: local-first.
- User model: single local admin/operator.
- PDF type: text-based PDFs only.
- Application stack: Next.js App Router with TypeScript.
- Server boundary: Next.js Route Handlers and server-side modules under `src/lib`.
- UI: React components in the current Next.js app.
- Application database: local SQLite through Prisma for uploaded PDF binaries, document metadata, chunks, and embeddings.
- PDF source storage: admin-uploaded PDFs stored in the local application database, not as loose files.
- RAG store: local Prisma/SQLite tables for MVP.
- AI provider: OpenAI API.
- Embeddings: OpenAI embeddings API, default model `text-embedding-3-small`.
- Chat generation: OpenAI Responses API through server-side code only.

## Change Rule

If implementation and documentation disagree, update the documentation first. The docs are the source of truth until the user approves a different direction.
