# System Architecture and LLM Orchestration Strategy

## High-Level Components
- **Presentation Studio Web App (Next.js/React):** Provides intake wizard, conversational co-creation UI, slide editor, and asset management.
- **Gateway & Auth (API Layer):** Handles OAuth/SAML for enterprise users, JWT service tokens, rate limiting, and request validation.
- **Content Ingestion Service:** Processes uploaded docs (PDF, DOCX, XLSX, URLs) using OCR and text extraction pipelines, normalizes data into structured summaries.
- **Prompt Orchestrator:** Coordinates multi-step LLM workflows (outline generation, slide copy drafting, tone adaptation, visual suggestions) using state machines and memory (Redis/Postgres).
- **Brand Intelligence Engine:** Stores brand kits (colors, fonts, tone descriptors) and enforces style guides through prompt templates and validation rules.
- **Slide Rendering Service:** Converts structured slide plans into PPTX/Google Slides via libraries (e.g., PptxGenJS, Google Slides API) and exports PDFs.
- **Asset Library & Storage:** Manages user assets in object storage (S3/GCS) with metadata indexing (Postgres/ElasticSearch).
- **Analytics & Logging:** Captures usage metrics, conversation transcripts (with consent), model latency, quality scores, and deck engagement data via instrumentation pipeline.

## Data Flow Overview
1. **User Intake:** Web app collects objectives, audience, assets, brand selection, and timelines. Data stored in Postgres; assets uploaded to storage.
2. **Ingestion:** Content service extracts text/tables/images; results persisted and linked to project session.
3. **LLM Orchestration:** Prompt Orchestrator invokes specialized agents:
   - Outline Planner Agent: synthesizes structure and section goals.
   - Slide Drafter Agent: produces slide-level headlines, bullets, speaker notes.
   - Tone Stylist Agent: adapts copy to brand voice guidelines.
   - Visual Recommender Agent: suggests imagery/charts referencing asset library.
4. **Conversation Loop:** Chat interface brokers user feedback; orchestrator updates session state and re-invokes relevant agents.
5. **Rendering:** Slide Rendering Service maps structured content to templates; brand engine enforces styling before exporting PPTX/Google Slides/PDF.
6. **Feedback & Analytics:** Actions logged to analytics service; quality signals feed evaluation dashboards and model fine-tuning pipelines.

## LLM Strategy
- **Model Mix:** Use hosted GPT-4.1/Claude for creative planning; fine-tuned smaller models for deterministic operations (tone enforcement, summarization).
- **Tooling:** Leverage LangChain or custom orchestrator for agent routing, function calling, and tool usage (e.g., data summarizers, chart generators).
- **Memory:** Maintain session context in Redis with vector search (e.g., Qdrant) to retrieve user-supplied assets and previous slide iterations.
- **Guardrails:** Apply policy filters (PII detection, brand compliance), automated hallucination checks, and fallback prompts for low-confidence outputs.
- **Latency Optimization:** Cache intermediate results, pre-fetch likely prompts, and stream responses to the UI.

## Integration Points
- **Google Workspace & Microsoft 365:** OAuth flows for Drive/SharePoint ingestion and Slides/PowerPoint export.
- **CRM/BI Systems:** Optional connectors (Salesforce, HubSpot, Tableau) via API keys to pull data into decks.
- **Webhook/API:** Provide programmable access for agencies to trigger deck generation from pipelines.

## Security & Compliance
- SOC2-ready architecture with audit logging, encryption at rest/in transit, role-based access control, and configurable data retention.
- Regional deployments and VPC peering for enterprise clients; configurable model hosting (e.g., Azure OpenAI) for data residency.

## Current Implementation Snapshot (MVP)
- **API Layer:** Fastify service (`apps/api`) with modular routes, Zod validation, and Prisma-powered repositories.
- **Persistence:** SQLite via Prisma for local development. Tables cover brand kits, decks, outline sections, and conversation messages. The ORM schema is migration-compatible with Postgres/MySQL once ready.
- **Data Seeding:** Prisma seed script hydrates the database using fixtures from `@slidesai/domain`, ensuring the dashboard/studio have content immediately after `pnpm db:seed`.
- **Web App:** Next.js (`apps/web`) fetches data from the API. If the API is offline, the UI gracefully falls back to in-memory fixtures so the experience never hard-crashes.
- **Orchestrator Toggle:** `USE_MOCK_ORCHESTRATOR=true` keeps deterministic responses. Switching to OpenAI or OpenRouter only requires flipping env vars (`LLM_PROVIDER=openai|openrouter`, `LLM_API_KEY=...`, `LLM_MODEL=...`). The orchestrator already streams the full transcript context for higher-quality answers.
- **Future Swaps:** Replace SQLite’s `DATABASE_URL` with a managed Postgres instance, enable a queue for long-running ingest jobs, and plug in brand governance checks before persisting generated slides.

