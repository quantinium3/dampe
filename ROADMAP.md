# DAMPE — Project Roadmap & Exam Explanation

This document summarizes the full project architecture, technology stack, where data is stored, how AI/RAG is used, and deep-dive talking points you can use during a practical exam.

**Project Overview**

- **Purpose:** File upload, AI-powered document analysis, summarization and search. Users upload files (PDF/DOCX/text/images); files are stored in Cloudflare R2; metadata and AI outputs are stored in a Postgres DB (Neon) via Drizzle ORM; AI models (Google Gemini and Groq LLMs) analyze and summarize content; Cloudflare AutoRAG is used for search.

**Tech Stack**

- **Frontend:** `Next.js 15` (app router), `React 19`, Tailwind CSS, Radix UI components, `sonner` toast library.
- **Backend / Server:** Next.js API routes running on the same Next server (edge-friendly patterns). Uses `drizzle-orm` with Neon (Postgres) for database access.
- **Auth:** `better-auth` with `drizzle` adapter storing users/sessions in Postgres.
- **Object Storage:** Cloudflare R2 (S3-compatible) accessed via the AWS SDK (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`).
- **Datastore / ORM:** `drizzle-orm` (Postgres connector via Neon HTTP).
- **LLM Providers / SDKs used:**
  - Google GenAI (`@google/genai`) — used for PDF parsing & summarization (Gemini family).
  - Groq SDK (`groq-sdk`) — used to call Groq-hosted LLMs (Llama family) for document & image analysis.
  - Cloudflare AutoRAG — used for retrieval-augmented search via Cloudflare's AutoRAG endpoint.
  - Notes: `@ai-sdk/anthropic`, `@huggingface/transformers`, and `@xenova/transformers` are present as dependencies but not actively used in the current codebase; they are available for future extension (Claude/Anthropic, Hugging Face models, on-device/runtime inference).

**Where files and data live**

- **File blobs:** Cloudflare R2 (`R2_BUCKET`) — uploaded via pre-signed `PUT` URLs from `src/app/api/files/route.ts`. Files are stored with keys like: ``uploads/{userId}/{namespaceId}-{filename}``.
- **File metadata & AI outputs:** Postgres (Neon) accessed through `src/db` and `drizzle-orm`. Table of interest: `files` (`ai_metadata` JSONB and `ai_analyzed` boolean). See `src/db/schema/file-schema.ts`.
- **Auth/session data:** Postgres tables `user`, `session`, `account`, `verification` via `src/db/schema/auth-schema.ts` and `src/lib/auth.ts` (better-auth + drizzle adapter).
- **Temporary access:** Pre-signed URLs are generated using `@aws-sdk/s3-request-presigner` and expire (10 minutes in current code).
- **Environment / secrets:** API keys and endpoints live in environment variables (example names used in this project): `DATABASE_URL`, `R2_ENDPOINT`, `R2_ACCESS_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `CLOUDFLARE_AI_SEARCH_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

**RAG (Cloudflare AutoRAG) usage**

- The app calls Cloudflare AutoRAG from `src/app/api/document-ai/search/route.ts`.
  - The route posts JSON to: `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/autorag/rags/nexus/ai-search` with the header `Authorization: Bearer {CLOUDFLARE_AI_SEARCH_TOKEN}`.
  - Cloudflare AutoRAG is used as a managed retrieval + generation service: the app sends a user query and receives a response produced from Cloudflare's retrieval+LLM pipeline.

- Important notes for exam:
  - The project delegates retrieval and ranking to Cloudflare (managed vector/indexing) rather than implementing a local vector DB.
  - The code assumes AutoRAG is already configured (a RAG named `nexus` exists in your Cloudflare account). Uploading or indexing documents into that RAG may be a separate pipeline or an administrative step in Cloudflare.

**Exact places in code where AI is called**

- `src/lib/file-parsers.ts` — uses `@google/genai` (Gemini) to parse PDFs and generate summaries (`gemini-2.5-flash` model in current code).
- `src/app/api/files/[id]/analyze/route.ts` — downloads file from R2 and calls Groq (`groq-sdk`) chat/completions for:
  - `llama-3.1-8b-instant` for text analysis (produces JSON metadata like summary, keywords, topics).
  - `meta-llama/llama-4-scout-17b-16e-instruct` for image analysis (asks the model to return JSON describing image caption, labels, OCR'd text, colors, safety).
- `src/app/api/files/[id]/summarize/route.ts` — fetches PDF from R2, passes bytes to `summarizePdf` which uses Google Gemini.
- `src/app/api/document-ai/search/route.ts` — calls Cloudflare AutoRAG endpoint for natural language search over indexed documents.

**Architecture / Request flows (short)**

- Upload flow:
  1. Frontend requests a presigned `PUT` URL from `POST /api/files`.
  2. Server inserts a `files` metadata row (upload_state=`uploading`) into Postgres.
  3. Server returns presigned URL (R2) and frontend uploads directly to R2.
  4. Client signals completion (or server polls) and `upload_state` is updated to `uploaded`.

- Analyze / Summarize flow:
  1. User clicks “Analyze” or “Summarize”. Frontend calls the API route for the file id.
  2. Server generates a presigned `GET` URL for the object in R2 and downloads bytes.
  3. Server calls the appropriate LLM (Gemini for PDFs, Groq Llama for text/image analysis).
  4. Parsed metadata/AI output is stored in `files.ai_metadata` and `ai_analyzed` is set to `true`.

- Search flow (RAG):
  1. User submits query from frontend (`/dashboard/document-ai` UI).
  2. Frontend calls `POST /api/document-ai/search` which proxies the query to Cloudflare AutoRAG.
  3. Cloudflare returns aggregated search+generation results which are returned to the frontend.

**Why these choices? (Advantages)**

- Cloudflare R2: low-cost, S3-compatible object storage with global edge presence; integrates easily with presigned URLs and serverless edge functions.
- Drizzle + Neon: serverless Postgres (Neon) + typed ORM makes schema-first queries and migrations straightforward and reliable.
- Google GenAI (Gemini): strong for multimodal document extraction and large-document understanding — good for PDF parsing and summarization.
- Groq-hosted LLMs (Llama family): fast, performant models for structured outputs and instruction-following; good for tailored JSON output extraction.
- Cloudflare AutoRAG: managed retrieval + generation — eliminates the need to host and maintain your own vector database and embedding pipeline.

**Model Deep-Dives (for exam cross-questioning)**

- **Google Gemini (via `@google/genai`) — `gemini-2.5-flash`**
  - Where used: `src/lib/file-parsers.ts` for `parsePdf` and `summarizePdf`.
  - Strengths: strong extractive and abstractive summarization; supports inline binary content (multimodal inputs) which this code uses by base64-encoding the PDF and sending it as `inlineData`.
  - Prompts & best practices: keep instruction explicit, prefer low temperature for extraction tasks; chunk very large PDFs and summarize incrementally; validate returned text length and fallback gracefully.
  - Limitations: cost and token limits for very large documents; you should chunk and deduplicate before sending; always validate model outputs (the code strips markdown fences and attempts JSON parsing).

- **Groq SDK LLMs (Llama variants)**
  - Where used: `src/app/api/files/[id]/analyze/route.ts`.
  - Models in code:
    - `llama-3.1-8b-instant` — used for long text analysis, asked to return a large JSON summary and metadata.
    - `meta-llama/llama-4-scout-17b-16e-instruct` — used for image analysis with an explicit JSON schema.
  - Prompting: the code asks for JSON-only responses and strips code fences before JSON.parse; this mitigates hallucination and format drift.
  - Strengths: flexible instruction-following and JSON-structured outputs; good if you need fine-grained control over output schema.
  - Caveats: always sanitize/validate JSON received (the project performs fallback parsing), set temperature low for deterministic metadata, watch for token limits when sending up to 100k-char slices.

- **Cloudflare AutoRAG**
  - Where used: `src/app/api/document-ai/search/route.ts` (proxy call to `autorag/.../ai-search`).
  - What it provides: combined retrieval from indexed documents + generation (answer synthesis) returned by Cloudflare-managed pipeline.
  - Why use it: offloads embedding/nearest-neighbor infrastructure and indexing to Cloudflare; convenient for production search features.
  - Questions to expect: how do documents get into the RAG? (Answer: either by using Cloudflare’s ingestion APIs, by connecting sources configured in Cloudflare, or by building an ingestion pipeline that computes embeddings and calls Cloudflare APIs — this project assumes a RAG named `nexus` is already available).

- **Anthropic / Hugging Face / Xenova**
  - These SDKs are present as dependencies but not used in the codebase. Mention them as possible extensions:
    - Anthropic (Claude) is good for safety-aligned instruction following.
    - Hugging Face / Xenova for local or browser inference (on-device models) when low-latency inference or offline demos are needed.

**Data flow & storage details — precise mapping**

- File blob: Cloudflare R2
  - API endpoints: configured via env `R2_ENDPOINT`, `R2_BUCKET`.
  - Access pattern: server generates `PUT` presigned URL (`getSignedUrl` with `PutObjectCommand`) — client uploads directly. For reading, server generates `GET` presigned URL (`GetObjectCommand`) and streams bytes for analysis.

- Metadata & AI outputs: Postgres (Neon)
  - Table: `files` — fields include `id`, `name`, `mime_type`, `size`, `key`, `ai_metadata` (JSONB), `ai_analyzed` (boolean), timestamps.
  - Auth tables: `user`, `session`, `account`, `verification` via `better-auth` adapter.

**Security & best practices**

- Do not commit secrets — this project uses env vars. For an exam explain `R2_*`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `CLOUDFLARE_AI_SEARCH_TOKEN`, `DATABASE_URL`.
- Use short-lived presigned URLs for uploads/downloads (current code uses 10 minutes). Only return the presigned URL to authorized users.
- Validate file types & sizes on upload. The code does basic MIME-type handling and enforces `size` in insert schema.

**Common exam questions and short answers (prep)**

- Q: Where are user files stored?
  - A: Files are stored in Cloudflare R2 (object storage). Metadata and AI outputs are stored in Postgres (Neon) via Drizzle.

- Q: How does RAG work in this project?
  - A: The app uses Cloudflare AutoRAG for retrieval-augmented search. The frontend sends a query to `POST /api/document-ai/search` which proxies to Cloudflare’s `autorag/.../ai-search`. Cloudflare handles retrieval and generation.

- Q: Which models are used and why?
  - A: Gemini (for robust PDF parsing and summarization), Groq Llama models (for structured JSON extraction and image understanding), Cloudflare AutoRAG (managed retrieval). Each is chosen for specific strengths: Gemini for multimodal content, Llama for instruction-based JSON outputs, AutoRAG for managed retrieval.

- Q: If AutoRAG is not available, how to implement RAG locally?
  - A: Implement a pipeline: chunk documents -> compute embeddings (e.g., OpenAI / Cohere / HuggingFace) -> store vectors in a vector DB (Pinecone / Weaviate / Supabase / Postgres + pgvector) -> on query compute embedding -> nearest neighbors -> pass retrieved chunks to an LLM for answer generation.

**Exam talk-through script (60-90 seconds)**

1. Brief: “This is an AI-powered document manager. Users upload documents; we store raw bytes in Cloudflare R2 and metadata in Postgres. The server generates presigned URLs for secure direct uploads.”
2. “When a user requests analysis, the server downloads the bytes from R2 and calls specialized LLMs: Gemini for PDF parsing/summarization and Groq-hosted Llama models for document and image analysis. Results are stored back into Postgres under `files.ai_metadata`.”
3. “For semantic search we use Cloudflare AutoRAG: the frontend sends the query to our API which proxies to the AutoRAG ai-search endpoint; Cloudflare returns retrieval+generation results.”
4. “Advantages: we separate object storage from metadata, use managed cloud services for retrieval and LLMs to reduce operational complexity, and keep the system modular so models or providers can be swapped.”

**Next steps / Extensions**

- Add ingestion pipeline to push documents into Cloudflare AutoRAG (if not already configured) or build a local vector store using embeddings + pgvector for more control.
- Add retries and chunking for very large PDFs, more robust JSON schema validation, and unit tests for AI routes.

---

If you want, I can also:
- create a one-page slide or printable cheat-sheet for you to bring to the exam,
- add a small `README_EXAM.md` in the repo with the concise speaking script and key file locations,
- or implement the missing RAG ingestion pipeline for Cloudflare or a local vector store.

File references (quick):

- `src/lib/file-parsers.ts` — Gemini PDF parse & summarize
- `src/app/api/files/[id]/analyze/route.ts` — Groq Llama analysis
- `src/app/api/files/route.ts` — upload record insertion & presigned PUT URL
- `src/app/api/files/[id]/summarize/route.ts` — presigned GET and Gemini summarization
- `src/app/api/document-ai/search/route.ts` — Cloudflare AutoRAG proxy
- `src/lib/r2.ts` — R2 S3 client configuration
- `src/db/schema/file-schema.ts` — Postgres `files` table with `ai_metadata`
