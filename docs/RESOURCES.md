# Resources And Setup Notes

## Required Local Tools

- Node.js 20 or newer.
- Git.
- A valid OpenAI API key.

## Runtime Dependencies

- `next`: App Router, route handlers, and local development server.
- `react` and `react-dom`: UI runtime.
- `@prisma/client`, `prisma`, `@prisma/adapter-better-sqlite3`, `better-sqlite3`: SQLite persistence.
- `openai`: OpenAI API client for embeddings and Responses API calls.
- `pdf-parse`: text extraction from text-based PDFs in the Node.js server runtime.
- `zod`: request validation.
- `@tanstack/react-query`: client-side API state.
- Existing UI utilities and components remain available for app UI work.

## Environment Variables

Root `.env` should include:

```env
DATABASE_URL=file:./dev.db
OPENAI_API_KEY=
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
MAX_UPLOAD_MB=50
CHUNK_SIZE_CHARS=3200
CHUNK_OVERLAP_CHARS=600
RETRIEVAL_TOP_K=5
```

Model names remain configurable instead of hard-coded in route handlers.

## Runtime Data

These runtime files and directories should not be committed:

```text
dev.db
*.db
.next/
node_modules/
```

Uploaded PDF binaries are stored in the SQLite database, not in a `data/uploads` directory.

## Local Commands

```powershell
npm install
npm run db:generate
npm run db:push
npm run dev
npm run build
npm run lint
```

## Official OpenAI References

- Responses API reference: https://platform.openai.com/docs/api-reference/responses
- Embeddings API reference: https://platform.openai.com/docs/api-reference/embeddings
- Embeddings guide: https://platform.openai.com/docs/guides/embeddings
- Retrieval guide: https://platform.openai.com/docs/guides/retrieval
- File search guide, for possible future hosted retrieval: https://platform.openai.com/docs/guides/tools-file-search

## Notes From Current OpenAI Docs Review

- OpenAI documents the Responses API as the model response interface used by this project.
- OpenAI embeddings are appropriate for semantic search and retrieval use cases.
- The embeddings API accepts one string or an array of strings, which allows batch embedding chunk text.
- The local implementation intentionally keeps storage and retrieval explicit instead of using hosted file search for MVP.
