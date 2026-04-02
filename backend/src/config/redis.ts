import IORedis from "ioredis";
import "dotenv/config";

// Singleton Redis Instance (Required for Rate-Limiting & BullMQ background jobs)
if (!process.env.REDIS_URL) {
  throw new Error("CRITICAL: REDIS_URL environment variable is missing.");
}

export const redisClient = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // Critical requirement ensuring BullMQ doesn't freeze under heavy load
});

redisClient.on("connect", () => {
    console.log("[Upstash Redis] Successfully connected for Distributed Cache & Queue.");
});

redisClient.on("error", (err) => {
    console.error("[Upstash Redis] Connection Error:", err);
});
