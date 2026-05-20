# Coding Standards

## General Standards

- Keep modules small and purpose-specific.
- Prefer explicit types over implicit shapes.
- Keep provider-specific code behind service boundaries.
- Use configuration instead of hard-coded paths, model names, and limits.
- Fail with clear typed errors at API boundaries.
- Do not catch exceptions just to hide them. Catch them to add context, map to a known error, or recover safely.
- Do not log secrets, full prompts, full documents, or raw provider payloads.

## Backend Python Standards

- Use Python 3.11 or newer.
- Use FastAPI routers for HTTP endpoints.
- Use Pydantic models for request and response schemas.
- Use type hints for all public functions and service methods.
- Use dependency injection for shared services where practical.
- Keep business logic out of route handlers.
- Use `pathlib.Path` for filesystem paths.
- Use UTC timestamps for stored metadata.
- Keep database access behind repository/service boundaries instead of route handlers.
- Prefer plain functions/classes over framework magic when simple.
- Keep OpenAI client creation centralized.

### Backend Formatting And Linting

- Use `ruff` for linting.
- Use `black` or `ruff format` for formatting.
- Use import sorting through `ruff`.
- Do not commit generated caches, virtualenvs, application database files, Chroma data, uploads, or secrets.

### Backend Testing

- Use `pytest`.
- Unit test chunking without OpenAI calls.
- Unit test prompt assembly without OpenAI calls.
- Unit test document repository behavior with a temporary local database.
- Mock OpenAI calls in service tests.
- Use tiny fixture PDFs for integration tests.
- Test API errors for invalid uploads and missing configuration.

## Frontend TypeScript Standards

- Use TypeScript in strict mode.
- Keep API calls in `src/api/`.
- Keep shared DTO types in `src/types/`.
- Keep components focused on rendering and user interaction.
- Do not put business rules in presentation components if they belong in backend.
- Do not call OpenAI from frontend code.
- Avoid global mutable state for MVP unless a clear need appears.

### Frontend Styling

- Keep styling consistent and accessible.
- Use semantic HTML for forms, buttons, status messages, and citations.
- Provide visible loading and error states.
- Ensure keyboard navigation works for upload, chat input, send, and delete actions.
- Do not rely on color alone to communicate status.

### Frontend Testing

- Add component tests for upload, document list, chat submission, and citation rendering when test tooling is added.
- Mock backend API calls in frontend tests.
- Verify API errors render useful messages.

## API Standards

- Use plural resource names: `/admin/documents`, `/chat`.
- Use JSON for non-file request/response bodies.
- Use `multipart/form-data` only for admin PDF upload.
- Use stable IDs in URLs.
- Use consistent error response shape:

```json
{
  "code": "DOCUMENT_NO_TEXT",
  "message": "The PDF does not contain extractable text."
}
```

## Comments And Documentation

- Add comments for non-obvious chunking, retrieval, or prompt logic.
- Do not add comments that repeat simple code.
- Public service methods should have short docstrings when behavior is not obvious.
- Update docs when behavior, setup, architecture, or conventions change.

## OpenAI API Usage Standards

- Keep model names configurable through environment settings.
- Keep embedding and chat generation in separate services.
- Retry only safe transient failures.
- Do not silently fall back to a different model unless documented.
- Review official OpenAI docs before changing API surface, model defaults, or hosted retrieval strategy.
