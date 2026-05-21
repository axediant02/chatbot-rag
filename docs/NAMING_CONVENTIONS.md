# Naming Conventions

## Repository Names

- Root project: `chatbot-rag`.
- App directory: `src/app`.
- Component directory: `src/components`.
- Server library directory: `src/lib`.
- Prisma schema: `prisma/schema.prisma`.
- Documentation directory: `docs`.

## TypeScript Names

- React components: `PascalCase.tsx`.
- Hooks: `useCamelCase.ts`.
- API helper modules: `camelCaseApi.ts` or resource names like `documentsApi.ts`.
- TypeScript types and interfaces: `PascalCase`.
- Component props: suffix `Props`.
- Variables and functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Server service files: `camelCase.ts`.

## API Names

- Next.js API routes live under `src/app/api`.
- Admin document management paths use `/api/admin/documents`.
- Chat path uses `/api/chat`.
- Paths use lowercase kebab-case only when needed.
- Resource paths are plural nouns.
- Dynamic route segments use camelCase folder names when reflected in TypeScript, for example `[documentId]`.
- JSON fields returned to the frontend use `camelCase`.

## Domain Entity Names

- `Document`: Uploaded PDF and its indexing metadata.
- `DocumentChunk`: Searchable text unit derived from a PDF page.
- `Citation`: Source reference returned with an answer.
- `ChatQuestion`: User question submitted to RAG.
- `ChatAnswer`: Generated grounded answer.
- `RetrievalResult`: Chunk returned from vector search with score and metadata.

## ID Conventions

- `documentId`: generated CUID or UUID string.
- `chunkId`: generated database ID.
- `chunkIndex`: zero-based index within a document.
- Never use raw filenames as primary IDs.

## Persistence Conventions

- Uploaded PDF binaries are stored in SQLite through Prisma, not as loose files.
- Original display filename is sanitized and stored in document metadata.
- Local database file: `dev.db` by default through `DATABASE_URL=file:./dev.db`.
- Chunk embeddings are stored as serialized JSON arrays in `DocumentChunk.embedding`.

## Environment Variable Names

- `DATABASE_URL`: Prisma SQLite connection string.
- `OPENAI_API_KEY`: OpenAI API key.
- `OPENAI_CHAT_MODEL`: model used for answer generation.
- `OPENAI_EMBEDDING_MODEL`: model used for embeddings, default `text-embedding-3-small`.
- `MAX_UPLOAD_MB`: upload size limit.
- `CHUNK_SIZE_CHARS`: target chunk size for MVP character-based chunking.
- `CHUNK_OVERLAP_CHARS`: target chunk overlap for MVP character-based chunking.
- `RETRIEVAL_TOP_K`: number of chunks retrieved per question.

## Error Code Names

- Error codes use `UPPER_SNAKE_CASE`.
- Use domain-specific prefixes:
  - `DOCUMENT_INVALID_TYPE`
  - `DOCUMENT_TOO_LARGE`
  - `DOCUMENT_NO_TEXT`
  - `DOCUMENT_NOT_FOUND`
  - `DATABASE_UNAVAILABLE`
  - `OPENAI_API_KEY_MISSING`
  - `OPENAI_REQUEST_FAILED`
  - `CHAT_NO_CONTEXT`
