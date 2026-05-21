# Engineering Practices

## Development Workflow

1. Read relevant docs before implementation.
2. Update docs first if behavior or architecture needs to change.
3. Implement the smallest vertical slice that can be tested.
4. Add or update tests when test tooling exists.
5. Run Prisma generation and app checks before considering work complete.
6. Keep unrelated changes out of the same patch.

## Testing Strategy

- Unit-testable logic should cover:
  - chunking
  - metadata construction
  - prompt assembly
  - error mapping
  - filename sanitization
  - cosine similarity
- Integration-style tests should cover local service boundaries when test tooling is added:
  - PDF upload and extraction
  - database persistence of uploaded PDF binaries and document metadata
  - indexing flow with mocked embeddings
  - chat flow with mocked retrieval/model response
- Manual tests cover user experience:
  - upload valid PDF
  - reject invalid PDF
  - ask answerable question
  - ask unanswerable question
  - delete document

## Quality Bar

- Code should be simple enough for a new developer to trace upload and chat flows without guessing.
- Public service functions should have predictable inputs and outputs.
- Error handling should produce useful frontend messages.
- Tests should not depend on live OpenAI calls by default.
- Live OpenAI calls should be limited to optional smoke tests.

## Git Practices

- Keep commits focused by feature or fix.
- Do not commit `.env`, local database files, uploaded PDFs, virtual environments, dependency caches, or build output.
- Prefer descriptive commit messages:
  - `docs: align rag architecture with nextjs`
  - `feat: add pdf ingestion endpoint`
  - `test: cover chunk overlap behavior`
  - `fix: handle empty pdf extraction`

## Security Practices

- Keep secrets in `.env` and document them in `.env.example`.
- Never print API keys.
- Never return provider credentials or raw provider errors to the browser.
- Validate uploads before processing.
- Sanitize filenames.
- Use generated IDs for persisted documents.
- Do not assume PDF contents are trustworthy.

## Observability Practices

- Log major operations with IDs and counts, not raw sensitive content.
- Include enough context to troubleshoot:
  - document ID
  - chunk count
  - page count
  - indexing status
  - retrieval count
  - elapsed time where useful
- Keep logs structured or consistently formatted.

## Dependency Practices

- Add dependencies only when they directly support documented behavior.
- Prefer established libraries with active maintenance.
- Pin or lock dependencies through `package-lock.json`.
- Document why non-obvious dependencies are introduced.
- Review OpenAI docs before changing API usage or model defaults.

## Performance Practices

- Batch embedding requests where practical.
- Avoid loading unnecessary full PDF text into responses.
- Keep PDF binary content out of frontend state and logs.
- Keep retrieval limits small to control prompt size.
- Add pagination to document lists only if needed after MVP.

## Review Checklist

- Does the change match the feature plan?
- Does it preserve server-only OpenAI access?
- Are errors typed and user-readable?
- Are citations preserved for grounded answers?
- Are docs updated if behavior changed?
- Do `npm run db:generate`, `npm run db:push`, `npm run build`, and `npm run lint` pass?
