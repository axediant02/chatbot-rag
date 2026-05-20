# Resources And Setup Notes

## Required Local Tools

- Python 3.11 or newer.
- Node.js 20 or newer.
- Git.
- A valid OpenAI API key.

## Backend Dependencies

Planned Python packages:

- `fastapi`: backend web framework.
- `uvicorn`: local ASGI server.
- `openai`: OpenAI API client.
- `sqlalchemy`: local application database access.
- `chromadb`: persistent local vector database.
- `pypdf`: text extraction from text-based PDFs.
- `python-multipart`: file upload support for FastAPI.
- `pydantic-settings`: environment-based configuration.
- `tiktoken`: token-aware chunk sizing where practical.
- `pytest`: backend testing.
- `ruff`: linting and formatting.

## Frontend Dependencies

Planned frontend packages:

- `vite`: frontend build/dev server.
- `react`: UI framework.
- `typescript`: typed frontend code.
- Optional UI utilities can be added only when implementation needs them.

## Environment Variables

Backend `.env` should include:

```env
OPENAI_API_KEY=
CHAT_MODEL=
EMBEDDING_MODEL=text-embedding-3-small
DATA_DIR=../data
DATABASE_URL=sqlite:///../data/app.db
CHROMA_DIR=../data/chroma
MAX_UPLOAD_MB=50
CHUNK_SIZE_TOKENS=800
CHUNK_OVERLAP_TOKENS=150
RETRIEVAL_TOP_K=5
```

`CHAT_MODEL` should be selected during implementation using current OpenAI model documentation and can remain configurable instead of hard-coded in application logic.

## Runtime Directories

These runtime files and directories should not be committed:

```text
data/app.db
data/chroma/
```

## Suggested Local Commands

Exact commands may change once package files are created.

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .[dev]
uvicorn app.main:app --reload
pytest
ruff check .
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
npm run build
```

## Official OpenAI References

- Responses API reference: https://platform.openai.com/docs/api-reference/responses
- Embeddings guide: https://platform.openai.com/docs/guides/embeddings
- Retrieval guide: https://platform.openai.com/docs/guides/retrieval
- File search guide, for possible future hosted retrieval: https://platform.openai.com/docs/guides/tools-file-search
- Embedding model reference: https://platform.openai.com/docs/models/text-embedding-3-small

## Notes From Current OpenAI Docs Review

- OpenAI documents the Responses API as the primary model response interface.
- OpenAI embeddings are appropriate for semantic search and retrieval use cases.
- OpenAI hosted vector stores and `file_search` can automatically chunk, embed, and search files, but this project intentionally starts with local Chroma so chunking and citations remain explicit.
- OpenAI docs describe default hosted vector store chunking around 800 tokens with overlap; the local implementation uses similar defaults but keeps overlap lower for MVP prompt-size control.
