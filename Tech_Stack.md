# Tech Stack & Architecture

## 1. Core Architecture Constraints
The core requirement is to handle intense, long-running AI workloads reliably using free-tier services. The architecture utilizes an enterprise-grade Queue system (BullMQ) backed by Redis, and a robust PostgreSQL database as the single source of truth. Security against supply chain attacks is paramount.

## 2. Frontend (Client-Side)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (for rapid UI development)
- **State/Form Handling:** React Hook Form + Zod (for client-side validation)
- **Real-Time Tracking:** Server-Sent Events (SSE) to track background job completion efficiently without polling server waste.
- **HTTP Client:** Native browser `fetch` API strictly. NO external HTTP libraries like `axios` to mitigate supply-chain zero-days.
- **Hosting:** Vercel or Netlify (Free Tier)

## 3. Backend (Server-Side)
- **Environment:** Node.js with Express.js (Rest API) and background workers.
- **Database:** PostgreSQL (Neon.tech or Supabase). Stores User Auth, Job States ('pending', 'processing', 'completed', 'failed'), and LLM structured output via `JSONB` columns.
- **ORM:** Drizzle ORM for lightweight, high-performance, and strict type-safe SQL database interactions.
- **Cache & Queue:** Redis (Upstash Free Tier). Powers distributed rate-limiting and the BullMQ asynchronous task queue.
- **Authentication:** JWT-based Auth utilizing secure, HTTP-only SameSite cookies.
- **Hosting:** Render (Free Tier web service) or Hugging Face Spaces (Docker).

## 4. Absolute Security & Supply-Chain Hardening
- **HTTP Client Hardening (Full-Stack):** Strict usage of the native Node.js and browser `fetch` APIs. `axios` is categorically banned across the entire monorepo to eliminate the `plain-crypto-js` remote access trojan (RAT) vector.
- **Dependency Auditing:** Pre-install lockfile scripts will automatically enforce `npm audit` and block the resolution of compromised modules across the workspace.
- **Worker Isolation:** The BullMQ worker daemon runs with the principle of least privilege. It will be sandboxed from global system secrets and injected ONLY with specific environmental variables it requires.
- **Rate Limiting & Sanitation:** `express-rate-limit` (Redis-backed), `Helmet.js`, and `Zod` validation.
- **Safe File Handling:** Strict `fs.unlink` cleanup running in `finally` and `catch` blocks.

## 5. The Agent "Brains" (APIs & Libraries)
- **Content Generation (LLM):** Groq API (Primary). Google Gemini API as an automated fallback. Outputs structured JSON.
- **Voice Generation (TTS):** `edge-tts` (Node.js wrapper).
- **Slide Compilation & Encoding:** `pptxgenjs`. Dynamically embeds `.mp3` media geometries. Finally, transcodes files stealthily into standard `.mp4` video format securely utilizing the `cloudconvert` Node.js SDK evading RAM overhead boundaries natively.

## 6. Monetization & Data
- **Payments:** Stripe Checkout Sessions.
- **Webhooks:** Stripe Webhooks protected with strict Payload Signature Verification.
