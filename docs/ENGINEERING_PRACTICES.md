# Engineering Practices

## Development Workflow

1. Read relevant docs before implementation.
2. Update docs first if behavior or architecture needs to change.
3. Implement the smallest vertical slice that can be tested.
4. Add or update tests with the change.
5. Run backend and frontend checks before considering work complete.
6. Keep unrelated changes out of the same patch.

## Testing Strategy

- Unit tests cover deterministic logic:
  - chunking
  - metadata construction
  - prompt assembly
  - error mapping
  - filename sanitization
- Integration tests cover local service boundaries:
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
- Public service methods should have predictable inputs and outputs.
- Error handling should produce useful frontend messages.
- Tests should not depend on live OpenAI calls by default.
- Live OpenAI calls should be limited to optional smoke tests.

## Git Practices

- Keep commits focused by feature or fix.
- Do not commit `.env`, local application database files, uploaded PDFs, Chroma data, virtual environments, dependency caches, or build output.
- Prefer descriptive commit messages:
  - `docs: add architecture and coding standards`
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
- Pin or lock dependencies once package management is initialized.
- Document why non-obvious dependencies are introduced.
- Review OpenAI docs before changing API usage or model defaults.

## Performance Practices

- Batch embedding requests where practical.
- Avoid loading unnecessary full PDF text into responses.
- Keep chunk text in vector storage, not frontend state.
- Keep PDF binary content in the application database, not frontend state or logs.
- Use retrieval limits to control prompt size.
- Add pagination to document lists only if needed after MVP.

## Review Checklist

- Does the change match the feature plan?
- Does it preserve backend-only OpenAI access?
- Are errors typed and user-readable?
- Are citations preserved for grounded answers?
- Are tests added or updated for changed logic?
- Are docs updated if behavior changed?
