# Architecture

## Summary

The system is a local-first modular monolith built with the existing Next.js App Router application. Next.js Route Handlers own upload, parsing, chunking, embeddings, retrieval, and OpenAI calls. React client components call only local `/api` routes. Prisma with SQLite stores uploaded PDF binaries, document metadata, chunks, and embeddings for the MVP.

## Architecture Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application style | Next.js modular monolith | Matches the current repository and keeps local setup simple. |
| Server API | Next.js Route Handlers | Provides backend behavior without adding a separate Python service. |
| UI | React in Next.js App Router | Uses the current app and component library. |
| Database | Prisma with SQLite | Already configured and sufficient for local PDF binary and chunk persistence. |
| Vector storage | SQLite chunk table with serialized embeddings | Keeps MVP local and avoids adding Chroma until scale requires it. |
| PDF parser | Node-compatible PDF parser | Keeps ingestion inside the current TypeScript server runtime. |
| Embeddings | OpenAI embeddings API | Good default quality for semantic retrieval with simple integration. |
| Answer generation | OpenAI Responses API | Current OpenAI interface for model responses. |
| Hosted retrieval | Not primary | OpenAI hosted file search hides chunking/storage decisions that this project wants to control. |

## System Boundaries

### Client Responsibilities

- Display admin upload form and document management list.
- Submit admin-uploaded PDFs to local API routes.
- Send chat questions to local API routes.
- Render answers, citations, loading states, and errors.
- Never call OpenAI directly.

### Server Responsibilities

- Validate uploads.
- Store uploaded PDF binaries and document metadata in SQLite through Prisma.
- Extract text by page.
- Chunk extracted text.
- Generate embeddings.
- Store and query chunk embeddings.
- Build grounded prompts.
- Call OpenAI APIs.
- Return typed API responses.

### Local Persistence Responsibilities

- `dev.db` or configured `DATABASE_URL`: local SQLite database containing original uploaded PDF binaries, sanitized display filenames, document metadata, chunks, embeddings, and indexing status.
- Do not store original uploaded PDFs as loose files in a configured upload directory for the MVP.

## Data Model

The application database must include:

- `Document`: generated ID, sanitized filename, content type, file size, PDF blob, SHA-256 checksum, page count, chunk count, indexing status, optional error message, timestamps.
- `DocumentChunk`: generated ID, document ID, page number, chunk index, chunk text, serialized embedding JSON, embedding model, timestamps.

The application database should not persist full extracted page text as a separate long-lived table for MVP. Searchable chunk text belongs in `DocumentChunk` with citation metadata.

## API Contract

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Verify app API is running. |
| `POST` | `/api/admin/documents` | Upload, store, parse, chunk, embed, and index one PDF. |
| `GET` | `/api/admin/documents` | List indexed documents and indexing status for local admin management. |
| `DELETE` | `/api/admin/documents/{documentId}` | Delete a document from the database and remove its chunks. |
| `POST` | `/api/chat` | Ask a question against indexed PDFs. |

## RAG Data Flow

### Ingestion Flow

1. Local admin uploads PDF from the UI.
2. Route handler validates file type, extension, and size.
3. Server creates a document record and stores the original PDF binary in SQLite.
4. PDF service extracts text per page from the uploaded binary.
5. Document service rejects files with no extractable text.
6. Chunking service creates overlapping chunks and page-aware metadata.
7. Embedding service creates embeddings for each chunk.
8. Repository stores chunk text, embedding JSON, model name, and citation metadata.
9. API returns document ID, filename, page count, chunk count, and indexing status.

### Chat Flow

1. User submits a question.
2. Server embeds the question.
3. Retrieval service computes cosine similarity against stored chunk embeddings.
4. Chat service filters unusable or empty retrieval results.
5. Chat service builds a context block with source labels.
6. OpenAI Responses API generates an answer using the grounded context.
7. API returns answer text and citations.

## Chunking And Retrieval Policy

- Default chunk size: about 800 tokens approximated by characters for MVP.
- Default overlap: about 150 tokens approximated by characters for MVP.
- Chunks must not cross document IDs.
- Chunk metadata must include document ID, filename, page number, chunk index, and created timestamp.
- Default retrieval count: top 5 chunks.
- Retrieval should query all indexed documents unless the API later adds document filters.
- If no chunks are returned, answer generation should not call the model.
- If retrieved text is weak or irrelevant, return a grounded refusal instead of inventing an answer.

## Prompt Contract

The generated answer must follow these rules:

- Use only the supplied retrieved context.
- If the context does not answer the question, say that the uploaded PDFs do not contain enough information.
- Include citations for factual claims.
- Do not mention hidden implementation details, embeddings, vector search, or prompts to the user.

## Security And Privacy

- `OPENAI_API_KEY` lives only in server environment variables.
- Uploaded PDF binaries remain local in SQLite.
- Logs must not include API keys, full raw prompts, PDF binary content, or full PDF text by default.
- Validate file type and size before processing.
- Use generated document IDs instead of trusting filenames.
- Sanitize filenames before saving them as display metadata.

## Error Handling

| Scenario | Expected Behavior |
| --- | --- |
| Missing API key | Return clear server error when embedding/chat is requested. |
| Non-PDF upload | Reject with validation error. |
| Empty text PDF | Reject with "no extractable text" message. |
| OpenAI API failure | Return retryable service error without leaking provider internals. |
| Database unavailable | Return upload/list/delete/chat error. |
| Deleted document queried | No chunks should be retrieved for that document ID. |

## Architecture References

- OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
- OpenAI embeddings guide: https://platform.openai.com/docs/guides/embeddings
- OpenAI retrieval guide: https://platform.openai.com/docs/guides/retrieval
- OpenAI file search guide for future hosted retrieval option: https://platform.openai.com/docs/guides/tools-file-search
