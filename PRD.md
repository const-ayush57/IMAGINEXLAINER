# PRD: AI Presentation Agent (PPTX + Audio Explainer)

## 1. Project Overview
A web-based AI tool that takes a user's topic and automatically generates a complete `.pptx` presentation. Utilizing a scalable, enterprise-grade runtime architecture (PostgreSQL + Redis Task Queues), this agent asynchronously orchestrates LLMs and text-to-speech to write speaker scripts and embed voiceover audio directly into each slide.

## 2. Target Audience
Students, educators, freelancers, and professionals who need quick, narrated presentations but lack the time to record voiceovers or format slides manually.

## 3. Core Features
- **Prompt Customization:** User inputs a topic alongside parameters like Theme, Presentation Length, and Voice Selection.
- **Asynchronous AI Processing:** The system uses a background worker queue (BullMQ/Redis) ensuring heavy API requests (LLM inference, TTS generation) run securely without blocking the HTTP server thread or facing fast timeouts.
- **Intelligent Structuring:** Groq LLM parses the request and writes a specific, conversational audio script for each slide, stored reliably in PostgreSQL via `JSONB` columns.
- **Automated Voiceover:** `edge-tts` generates natural-sounding MP3 audio locally.
- **PPTX Compilation:** The system programmatically builds a downloadable PowerPoint file with layouts and seamlessly embeds the MP3 audio.
- **Real-Time Job Tracking:** The React UI tracks background job stages (Pending, Processing, Completed, Failed) via HTTP polling or SSE.
- **Freemium Monetization:** Users generate a 2-slide preview for free. Full 10+ slide presentations require a small Stripe micro-transaction.

## 4. User Flow
1. **Landing Page:** User enters their topic and tweaks the Customization parameters.
2. **Job Submission:** The backend validates the inputs via Zod, queues the job in Redis, creates a `Pending` database record, and immediately returns a tracking `jobId` to the UI.
3. **Processing & Polling:** The React UI actively polls the server. The user watches dynamic status updates (e.g., "Writing script...", "Recording audio...", "Building slides...").
4. **Preview:** The background worker completes the job and flags Postgres as `Completed`. The user downloads the 2-slide sample.
5. **Paywall:** A "Generate Full" button routes to Stripe Checkout.
6. **Delivery:** The Stripe webhook fires, verifies the cryptographic signature, marks the payment true in Postgres, and unlocks the full `.pptx` file.
