# Documentation Index

This documentation defines the build contract for the PDF RAG chatbot.

## Documents

- `FEATURE_PLAN.md`: Product scope, requirements, MVP phases, acceptance criteria.
- `ARCHITECTURE.md`: System design, components, APIs, data flow, RAG pipeline, storage, security.
- `CODING_STANDARDS.md`: Backend and frontend coding rules, testing expectations, error handling.
- `NAMING_CONVENTIONS.md`: Naming rules for files, modules, APIs, types, IDs, config, and vector data.
- `ENGINEERING_PRACTICES.md`: Workflow, testing discipline, review criteria, security, observability, dependency practices.
- `RESOURCES.md`: Required tools, libraries, environment variables, local directories, official references.

## Current Decisions

- Deployment target: local-first.
- User model: single local admin/operator.
- PDF type: text-based PDFs only.
- PDF source storage: admin-uploaded PDFs stored in the local application database.
- RAG store: local vector database.
- Application database: local SQLite database for original PDF binaries and document metadata.
- Backend: FastAPI.
- Frontend: React with Vite and TypeScript.
- Vector DB: Chroma persistent local storage.
- AI provider: OpenAI API.
- Embeddings: OpenAI embeddings API, default model `text-embedding-3-small`.
- Chat generation: OpenAI Responses API through backend only.

## Change Rule

If implementation and documentation disagree, pause implementation and update the documentation first. The docs are the source of truth until the user approves a different direction.
