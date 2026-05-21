# Coding Standards

## General Standards

- Keep modules small and purpose-specific.
- Prefer explicit TypeScript types over implicit response shapes.
- Keep provider-specific code behind server-side service boundaries.
- Use configuration instead of hard-coded model names and limits.
- Fail with clear typed errors at API boundaries.
- Do not catch exceptions just to hide them. Catch them to add context, map to a known error, or recover safely.
- Do not log secrets, full prompts, full documents, PDF binary content, or raw provider payloads.

## Next.js And Server Standards

- Use the existing Next.js App Router structure.
- Use Route Handlers under `src/app/api/**/route.ts` for HTTP endpoints.
- Keep route handlers thin: validate input, call server services, return typed responses.
- Keep RAG business logic in server-only modules under `src/lib`.
- Use Prisma for SQLite persistence.
- Keep database access behind repository/service functions instead of React components.
- Use UTC timestamps for stored metadata.
- Keep OpenAI client creation centralized in a server-only module.
- Never expose `OPENAI_API_KEY` to client components, browser logs, API responses, or committed files.
- Mark upload/chat routes with Node.js runtime when they depend on Node APIs or binary parsing.

## TypeScript Standards

- Use TypeScript in strict mode.
- Use Zod or explicit validation helpers for request validation.
- Keep shared DTO types in `src/types` when they are used by both routes and UI.
- Use `camelCase` for TypeScript fields returned to the frontend.
- Convert Prisma records into explicit response DTOs before returning JSON.
- Avoid global mutable state except for the existing Prisma client singleton pattern.

## Formatting And Linting

- Use the project ESLint and TypeScript configuration.
- Do not commit generated caches, local database files, uploaded PDFs, build output, or secrets.
- Do not run formatters that rewrite unrelated files.

## Testing

- Unit test deterministic logic where test tooling exists:
  - PDF validation
  - filename sanitization
  - chunking
  - citation metadata construction
  - cosine similarity retrieval
  - prompt/context assembly
- Mock OpenAI calls in tests.
- Use tiny fixture PDFs for integration-style route tests when test tooling is added.
- Test API errors for invalid uploads, empty text PDFs, missing API key, and no-context chat.

## Frontend Standards

- Keep interactive UI in client components.
- Keep API calls in client components or small API helper functions; never call OpenAI directly from frontend code.
- Keep components focused on rendering and user interaction.
- Do not put RAG, database, embedding, or prompt rules in presentation components.
- Keep styling consistent and accessible.
- Use semantic HTML for upload, document management, chat input, send, delete, status messages, and citations.
- Provide visible loading and error states.
- Ensure keyboard navigation works for upload, chat input, send, and delete actions.
- Do not rely on color alone to communicate status.

## API Standards

- Public app routes use the Next.js `/api` prefix.
- Admin document management routes use `/api/admin/documents`.
- Chat route uses `/api/chat`.
- Use JSON for non-file request and response bodies.
- Use `multipart/form-data` only for admin PDF upload.
- Use stable IDs in URLs.
- Use consistent error response shape:

```json
{
  "code": "DOCUMENT_NO_TEXT",
  "message": "The PDF does not contain extractable text."
}
```

## OpenAI API Usage Standards

- Keep model names configurable through environment settings.
- Use OpenAI embeddings for chunk and query vectors.
- Use the OpenAI Responses API for grounded answer generation.
- Keep embedding and chat generation in separate server-side functions.
- Retry only safe transient failures.
- Do not silently fall back to a different model unless documented.
- Review official OpenAI docs before changing API surface, model defaults, or hosted retrieval strategy.

## Comments And Documentation

- Add comments only for non-obvious chunking, retrieval, binary parsing, or prompt logic.
- Do not add comments that repeat simple code.
- Public service functions should have short docstrings or clear names when behavior is not obvious.
- Update docs when behavior, setup, architecture, or conventions change.
