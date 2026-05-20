# Feature Plan

## Summary

Build a local-first PDF chatbot that lets a local admin upload text-based PDFs, stores the uploaded PDF files in a local application database, indexes them with a local RAG pipeline, and lets the user ask questions against the indexed document set. Answers must include citations back to retrieved PDF pages/chunks.

## Goals

- Provide accurate answers grounded in uploaded PDFs.
- Persist uploaded PDF files and document metadata in the local application database instead of relying on a configured PDF folder.
- Make chunking, retrieval, and citations explicit and inspectable.
- Keep the first version easy to run locally.
- Keep OpenAI API secrets server-side.
- Build a clean foundation that can later support OCR, authentication, cloud deployment, or hosted retrieval if requested.

## Non-Goals For MVP

- OCR for scanned PDFs.
- Multi-user accounts, authentication, or role-based access control.
- Public cloud deployment.
- Chat history persistence across app restarts.
- Fine-tuning.
- Hosted OpenAI `file_search` as the primary retrieval system.
- Non-PDF document types.

## Functional Requirements

| ID | Priority | Requirement |
| --- | --- | --- |
| FR-001 | Must | Local admin can upload a text-based PDF through the web UI. |
| FR-002 | Must | System extracts text from each PDF page and detects PDFs with no extractable text. |
| FR-003 | Must | System chunks extracted text with overlap and stores page-aware chunk metadata. |
| FR-004 | Must | System creates embeddings for chunks using the backend OpenAI client. |
| FR-005 | Must | System stores the original PDF binary, sanitized filename, document metadata, and indexing status in a local application database. |
| FR-006 | Must | System stores vectors and retrieval metadata in a persistent local vector database. |
| FR-007 | Must | User can ask a question against all indexed PDFs. |
| FR-008 | Must | System retrieves relevant chunks and uses them as grounded context for answer generation. |
| FR-009 | Must | Chat answers include citations with filename, page, and chunk reference. |
| FR-010 | Must | System refuses or qualifies answers when retrieved context is insufficient. |
| FR-011 | Must | Local admin can view indexed documents and delete a document from the database and index. |
| FR-012 | Should | Frontend shows upload/indexing status and readable error messages. |
| FR-013 | Should | Backend exposes health and readiness endpoints for local troubleshooting. |
| FR-014 | Could | User can tune retrieval count and chunk settings through configuration. |
| FR-015 | Could | User can inspect retrieved source snippets before or after answer generation. |

## Non-Functional Requirements

| ID | Priority | Requirement |
| --- | --- | --- |
| NFR-001 | Must | `OPENAI_API_KEY` is loaded only by the backend and never exposed to frontend code. |
| NFR-002 | Must | Core RAG services have unit tests for chunking, metadata handling, retrieval fallback, and prompt assembly. |
| NFR-003 | Must | The app can run locally with documented commands and environment variables. |
| NFR-004 | Must | Upload validation rejects non-PDF files and PDFs with no extractable text. |
| NFR-005 | Must | Original PDF files are not stored as loose runtime files; they are persisted in the local application database. |
| NFR-006 | Should | Chat requests return a clear error when OpenAI API credentials are missing or invalid. |
| NFR-007 | Should | The backend logs major pipeline steps without logging API keys, full sensitive prompts, or PDF binary content by default. |
| NFR-008 | Should | The app remains usable for small to medium PDFs, roughly up to 50 MB per file for MVP. |
| NFR-009 | Could | Add integration tests using small fixture PDFs. |

## MVP Milestones

### Milestone 1: Backend Foundation

- Create FastAPI app structure.
- Add environment configuration.
- Add local application database configuration.
- Add health endpoint.
- Add PDF upload endpoint skeleton.
- Add test framework.

Acceptance criteria:

- Backend starts locally.
- Health endpoint returns status.
- Missing `OPENAI_API_KEY` is reported clearly when AI features are used.

### Milestone 2: PDF Ingestion And Indexing

- Parse uploaded PDFs with page-aware text extraction.
- Store original PDF binary and document metadata in the local application database.
- Chunk text with configured size and overlap.
- Generate embeddings.
- Store vectors and metadata in Chroma.
- List and delete documents.

Acceptance criteria:

- Uploading a valid text PDF stores the PDF in the database and creates searchable chunks.
- Uploading an invalid or empty PDF returns a useful error.
- Deleting a document removes its chunks from retrieval.

### Milestone 3: Chat RAG

- Embed the user query.
- Retrieve top relevant chunks.
- Build grounded prompt/context.
- Generate answer through the OpenAI Responses API.
- Return citations.

Acceptance criteria:

- Answerable questions produce cited answers.
- Unanswerable questions from the PDFs produce an explicit "not enough context" response.
- Citations include filename, page number, and chunk ID.

### Milestone 4: Frontend UI

- Add admin upload panel.
- Add document list.
- Add chat interface.
- Add citation display.
- Add loading and error states.

Acceptance criteria:

- Local admin can upload, inspect, and delete documents from the browser, and the user can ask questions and inspect citations.
- Frontend does not contain OpenAI credentials or direct OpenAI API calls.

## Future Enhancements

- OCR fallback for scanned PDFs.
- Per-document chat filters.
- Chat history persistence.
- Streaming responses.
- Hosted deployment.
- Authentication and user-owned document libraries.
- Hybrid retrieval using semantic similarity plus keyword search.
- Optional OpenAI hosted `file_search` adapter.
