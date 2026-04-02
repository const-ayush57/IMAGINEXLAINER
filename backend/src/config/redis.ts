import IORedis from "ioredis";
import "dotenv/config";

// Singleton Redis Instance (Required for Rate-Limiting & BullMQ background jobs)
if (!process.env.REDIS_URL) {
  throw new Error("CRITICAL: REDIS_URL environment variable is missing.");
}

export const redisClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,  // Critical for BullMQ
  family: 0,                   // Auto IPv4/IPv6 on Render
  enableAutoPipelining: true,
  keepAlive: 5000,             // TCP keepalive every 5s — prevents Upstash dropping idle sockets
  retryStrategy: (times) => Math.min(times * 200, 5000),
  tls: process.env.REDIS_URL.includes("rediss://") ? { rejectUnauthorized: false } : undefined,
});

// Heartbeat: Upstash Serverless drops idle connections after ~10s.
// Ping every 8s to keep the socket alive and stop the ECONNRESET loop.
setInterval(() => {
  redisClient.ping().catch(() => {}); // Silently discard — retryStrategy handles reconnects
}, 8000);

redisClient.on("connect", () => {
  console.log("[Upstash Redis] Connected.");
});

redisClient.on("error", (err: any) => {
  // ECONNRESET is expected on Upstash Serverless free tier — retryStrategy handles it automatically.
  if (err?.code !== "ECONNRESET") {
    console.error("[Upstash Redis] Connection Error:", err);
  }
});
