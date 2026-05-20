# Architecture

## Summary

The system is a local-first modular monolith with a FastAPI backend, React/Vite frontend, local application database for uploaded PDF binaries and document metadata, and persistent Chroma vector storage. The backend owns all AI and RAG operations. The frontend is a client of the backend only.

## Architecture Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application style | Modular monolith | Lowest operational complexity for local-first MVP while preserving module boundaries. |
| Backend | FastAPI | Strong Python ecosystem for PDF parsing, embeddings, and vector DB integration. |
| Frontend | React, Vite, TypeScript | Fast local development and typed UI code. |
| Application database | SQLite | Local-first persistence for uploaded PDF binaries, document metadata, and indexing status without requiring a separate database server. |
| Vector store | Chroma persistent client | Local storage, simple developer setup, explicit control over chunks and metadata. |
| PDF parser | `pypdf` | Handles text extraction for selectable-text PDFs without OCR complexity. |
| Embeddings | OpenAI embeddings API | Good default quality for semantic retrieval with simple integration. |
| Answer generation | OpenAI Responses API | Current OpenAI interface for model responses and tool-capable workflows. |
| Hosted retrieval | Not primary | OpenAI `file_search` is useful but hides chunking and storage decisions that this project wants to control. |

## System Boundaries

### Frontend Responsibilities

- Display admin upload form and document management list.
- Submit admin-uploaded PDFs to backend.
- Send chat questions to backend.
- Render answers, citations, loading states, and errors.
- Never call OpenAI directly.

### Backend Responsibilities

- Validate uploads.
- Store uploaded PDF binaries and document metadata in the application database.
- Extract text by page.
- Chunk extracted text.
- Generate embeddings.
- Store and query vector data.
- Build grounded prompts.
- Call OpenAI APIs.
- Return typed API responses.

### Local Persistence Responsibilities

- `data/app.db`: local application database containing original uploaded PDF binaries, sanitized display filenames, document metadata, and indexing status.
- `data/chroma/`: persistent vector DB files for chunk text, embeddings, and retrieval metadata.
- Do not store original uploaded PDFs as loose files in a configured upload directory for the MVP.

### Application Database Records

The application database must include a document record for each uploaded PDF with at least:

- `document_id`: generated UUID primary ID.
- `original_filename`: sanitized display filename.
- `content_type`: validated PDF MIME type when available.
- `file_size_bytes`: original upload size.
- `pdf_blob`: original PDF binary content.
- `sha256`: optional checksum for duplicate detection and troubleshooting.
- `page_count`: number of extracted pages after parsing.
- `chunk_count`: number of indexed chunks.
- `indexing_status`: current ingestion state, such as `pending`, `indexed`, or `failed`.
- `created_at` and `updated_at`: UTC timestamps.

The application database should not persist full extracted page text for MVP unless this architecture document is updated. Searchable chunk text belongs in the vector store with citation metadata.

## Proposed Repository Structure

```text
chatbot-rag/
  AGENTS.md
  docs/
  backend/
    app/
      api/
      core/
      models/
      schemas/
      services/
      tests/
    pyproject.toml
    .env.example
  frontend/
    src/
      api/
      components/
      pages/
      types/
      styles/
    package.json
  data/
    app.db
    chroma/
```

## Backend Modules

| Module | Responsibility |
| --- | --- |
| `api` | FastAPI routers, request/response boundaries, HTTP errors. |
| `core` | Settings, logging, app startup, shared constants. |
| `schemas` | Pydantic request/response DTOs. |
| `models` | Internal domain models. |
| `services.pdf_service` | Validate PDFs and extract page text. |
| `services.chunking_service` | Split extracted text into overlapping chunks. |
| `services.embedding_service` | Call OpenAI embeddings API. |
| `services.document_repository` | Persist and load PDF binaries, document metadata, and indexing status from the application database. |
| `services.vector_store_service` | Persist, query, and delete chunks in Chroma. |
| `services.chat_service` | Retrieve context, assemble prompt, call OpenAI Responses API. |
| `services.document_service` | Coordinate admin upload, database persistence, indexing, listing, and deletion. |

## API Contract

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Verify backend process is running. |
| `GET` | `/ready` | Verify required local database, vector store, and runtime config are usable. |
| `POST` | `/admin/documents` | Upload, store, parse, chunk, embed, and index one PDF. |
| `GET` | `/admin/documents` | List indexed documents and indexing status for local admin management. |
| `DELETE` | `/admin/documents/{document_id}` | Delete a document from the database and remove its chunks from the vector store. |
| `POST` | `/chat` | Ask a question against indexed PDFs. |

### Response Shape Principles

- Use explicit response DTOs.
- Return stable IDs.
- Return human-readable `message` fields for user-facing errors.
- Return machine-readable `code` fields for frontend branching.
- Do not return full prompts, API keys, or raw provider error payloads.

## RAG Data Flow

### Ingestion Flow

1. Local admin uploads PDF from frontend.
2. Backend validates MIME type and file extension.
3. Backend creates a document record and stores the original PDF binary in the application database.
4. PDF service extracts text per page from the stored PDF binary.
5. Document service rejects files with no extractable text.
6. Document repository updates page count, sanitized filename, file size, checksum if available, and indexing status.
7. Chunking service creates overlapping chunks and page-aware metadata.
8. Embedding service creates embeddings for each chunk.
9. Vector store service writes chunk text, embeddings, and retrieval metadata to Chroma.
10. API returns document ID, filename, page count, chunk count, and indexing status.

### Chat Flow

1. User submits a question.
2. Backend embeds the question.
3. Vector store retrieves top relevant chunks.
4. Chat service filters unusable or empty retrieval results.
5. Chat service builds a context block with source labels.
6. OpenAI Responses API generates an answer using the grounded context.
7. Backend returns answer text and citations.

## Chunking Policy

- Default chunk size: about 800 tokens or equivalent character approximation if tokenization is not available.
- Default overlap: about 150 tokens.
- Chunks must not cross document IDs.
- Chunk metadata must include:
  - `document_id`
  - `filename`
  - `page_number`
  - `chunk_index`
  - `source_type`
  - `created_at`
- Chunk metadata should not contain PDF binary content.
- If one page is longer than the chunk size, split it into multiple chunks with the same page number.

## Retrieval Policy

- Default retrieval count: top 5 chunks.
- Retrieval should query all indexed documents unless the API later adds document filters.
- If no chunks are returned, answer generation should not call the model unless the UX explicitly wants a model-written refusal.
- If retrieved text is weak or irrelevant, return a grounded refusal instead of inventing an answer.

## Prompt Contract

The generated answer must follow these rules:

- Use only the supplied retrieved context.
- If the context does not answer the question, say that the uploaded PDFs do not contain enough information.
- Include citations for factual claims.
- Do not mention hidden implementation details, embeddings, vector search, or prompts to the user.

## Security And Privacy

- `OPENAI_API_KEY` lives only in backend environment variables.
- Uploaded PDF binaries remain local in the application database.
- Chroma data remains local under `data/chroma/`.
- Logs must not include API keys, full raw prompts, PDF binary content, or full PDF text by default.
- Validate file type and size before processing.
- Use generated document IDs instead of trusting filenames.
- Sanitize filenames before saving them as display metadata.

## Error Handling

| Scenario | Expected Behavior |
| --- | --- |
| Missing API key | Return clear backend error when embedding/chat is requested. |
| Non-PDF upload | Reject with validation error. |
| Empty text PDF | Reject with "no extractable text" message. |
| OpenAI API failure | Return retryable service error without leaking provider internals. |
| Application database unavailable | Return readiness failure and upload/list/delete error. |
| Vector DB unavailable | Return readiness failure and chat/indexing error. |
| Deleted document queried | No chunks should be retrieved for that document ID. |

## Observability

- Log upload start/end with document ID and filename.
- Log chunk count and page count.
- Log embedding batch size.
- Log retrieval count and document IDs, not full chunk text.
- Log database failures without PDF binary content.
- Log OpenAI request failures with provider request ID if available.

## Architecture References

- OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
- OpenAI embeddings guide: https://platform.openai.com/docs/guides/embeddings
- OpenAI retrieval guide: https://platform.openai.com/docs/guides/retrieval
- OpenAI file search guide for future hosted retrieval option: https://platform.openai.com/docs/guides/tools-file-search
