# Naming Conventions

## Repository Names

- Root project: `chatbot-rag`.
- Backend directory: `backend`.
- Frontend directory: `frontend`.
- Local runtime data directory: `data`.
- Local application database file: `data/app.db`.
- Documentation directory: `docs`.

## Backend Python Names

- Python files: `snake_case.py`.
- Packages: `snake_case`.
- Functions and variables: `snake_case`.
- Classes: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Pydantic request schemas: suffix `Request`.
- Pydantic response schemas: suffix `Response`.
- Internal domain models: descriptive noun names, for example `DocumentChunk`.
- Service classes: suffix `Service`, for example `ChatService`.

## Frontend TypeScript Names

- React components: `PascalCase.tsx`.
- Hooks: `useCamelCase.ts`.
- API modules: `camelCaseApi.ts` or resource names like `documentsApi.ts`.
- TypeScript types and interfaces: `PascalCase`.
- Component props: suffix `Props`.
- Variables and functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.

## API Names

- Paths use lowercase kebab-case only when needed.
- Resource paths are plural nouns.
- Admin-only local operator paths use the `/admin` prefix.
- IDs in path params use snake_case names in backend code:
  - `document_id`
  - `chunk_id`
  - `conversation_id`
- JSON fields use `snake_case` for backend responses unless frontend mapping is explicitly introduced.

## Domain Entity Names

- `Document`: Uploaded PDF and its indexing metadata.
- `DocumentPage`: Extracted page text and page number.
- `DocumentChunk`: Searchable text unit derived from a page.
- `Citation`: Source reference returned with an answer.
- `ChatQuestion`: User question submitted to RAG.
- `ChatAnswer`: Generated grounded answer.
- `RetrievalResult`: Chunk returned from vector search with score and metadata.

## ID Conventions

- `document_id`: generated UUID string.
- `chunk_id`: `{document_id}:{chunk_index}`.
- `upload_id`: optional generated UUID for tracking upload operations.
- Never use raw filenames as primary IDs.

## Persistence Conventions

- Uploaded PDF binaries are stored in the application database, not as loose files.
- Original display filename is sanitized and stored in document metadata.
- Application database file: `data/app.db`.
- Chroma collection name: `pdf_chunks`.
- Runtime directories:
  - `data`
  - `data/chroma`

## Environment Variable Names

- `OPENAI_API_KEY`: OpenAI API key.
- `CHAT_MODEL`: model used for answer generation.
- `EMBEDDING_MODEL`: model used for embeddings, default `text-embedding-3-small`.
- `DATA_DIR`: root runtime data directory.
- `DATABASE_URL`: local application database connection string.
- `CHROMA_DIR`: Chroma persistence directory.
- `MAX_UPLOAD_MB`: upload size limit.
- `CHUNK_SIZE_TOKENS`: target chunk size.
- `CHUNK_OVERLAP_TOKENS`: target chunk overlap.
- `RETRIEVAL_TOP_K`: number of chunks retrieved per question.

## Error Code Names

- Error codes use `UPPER_SNAKE_CASE`.
- Use domain-specific prefixes:
  - `DOCUMENT_INVALID_TYPE`
  - `DOCUMENT_TOO_LARGE`
  - `DOCUMENT_NO_TEXT`
  - `DOCUMENT_NOT_FOUND`
  - `VECTOR_STORE_UNAVAILABLE`
  - `OPENAI_API_KEY_MISSING`
  - `OPENAI_REQUEST_FAILED`
  - `CHAT_NO_CONTEXT`
