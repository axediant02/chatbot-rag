# Agent Guide

This repository is a local-first PDF RAG chatbot. Agents must treat the documentation in `docs/` as the implementation contract until the user changes it.

## Project Intent

- Build a chatbot that answers questions from uploaded text-based PDF files.
- Use explicit RAG: extract PDF text, chunk it, embed chunks, store vectors locally, retrieve relevant chunks, and generate grounded answers with citations.
- Start as a single-user local application. Do not add authentication, cloud deployment, OCR, billing, or multi-tenant behavior unless requested.

## Required Reading Before Implementation

1. `docs/README.md`
2. `docs/FEATURE_PLAN.md`
3. `docs/ARCHITECTURE.md`
4. `docs/CODING_STANDARDS.md`
5. `docs/NAMING_CONVENTIONS.md`
6. `docs/ENGINEERING_PRACTICES.md`
7. `docs/RESOURCES.md`

## Working Rules

- Keep implementation aligned with the documented architecture and scope.
- If implementation requires a different architecture, update the relevant documentation before changing code.
- Keep secrets server-side. Never expose `OPENAI_API_KEY` to frontend code, browser logs, committed files, or API responses.
- Prefer simple, local, observable behavior over abstraction that is not needed for the MVP.
- Preserve source citations in chat responses: filename, page number, and chunk reference.
- Treat scanned PDF/OCR support as out of scope for MVP.
- Do not store uploaded PDF content or extracted text outside the documented `data/` directories unless the architecture is updated first.

## Implementation Guardrails

- Backend must own PDF parsing, chunking, embeddings, vector search, and OpenAI calls.
- Frontend must call only the backend API. It must not call OpenAI directly.
- RAG answer generation must use retrieved context only. If retrieved context is insufficient, the assistant should say it cannot answer from the uploaded PDFs.
- API responses should be typed and predictable. Avoid ad hoc response shapes.
- Add tests for core services before or with implementation work.

## Documentation Maintenance

- Update `docs/FEATURE_PLAN.md` when scope changes.
- Update `docs/ARCHITECTURE.md` when component boundaries, data flow, APIs, or storage decisions change.
- Update `docs/CODING_STANDARDS.md` and `docs/NAMING_CONVENTIONS.md` before introducing new conventions.
- Update `docs/RESOURCES.md` when dependencies, setup steps, environment variables, or official references change.

