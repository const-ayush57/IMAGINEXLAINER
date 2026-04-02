import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from '../middleware/rateLimiter';
import { authRouter } from './routes/auth';
import { presentationRouter } from './routes/presentation';
import { checkoutRouter } from './routes/checkout';
import { webhookRouter } from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser()); // Critical extraction logic mapping JWT HTTP-only cookies securely tracking context arrays

// ============================================
// CRITICAL STRIPE ARCHITECTURE REQUIREMENT:
// We MUST mount the webhook route BEFORE `express.json()` parses payloads.
// Stripe strictly requires raw, un-mutated byte buffers to reconstruct cryptographic algorithms appropriately.
// ============================================
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter);

// Global parsing mapped back structurally protecting native domains via Upstash bounds
app.use(express.json());
app.use(globalRateLimiter);

// ---------------------
// Application Node Trees
// ---------------------
app.use('/api/auth', authRouter);
app.use('/api', presentationRouter); 
app.use('/api/checkout', checkoutRouter); // Active Monetization Flow Tunnel

// Health mapping integrations securely resolving Nginx reverse bindings
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Monetization API Operational. Raw Stripe hooks injected.', 
    service: 'Core Express Routing Layer tracking Webhooks properly.' 
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[API] Server listening on 0.0.0.0:${PORT}`);
});
