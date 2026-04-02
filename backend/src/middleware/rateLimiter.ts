import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis";

// Global Rate Limiter: Strictly protects endpoints from DDoS and quota draining
export const globalRateLimiter = rateLimit({
  store: new RedisStore({
    // Typecast required by library, but functional implementation
    sendCommand: (...args: string[]) => redisClient.call(...args) as any,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests from this IP, please try again in 15 minutes.",
  },
});

// Stricter Rate Limiter exclusively for Auth endpoints (Brute-force protection)
export const authRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args) as any,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 4, // Max 10 login/register attempts per hour per IP
  message: {
    error: "Too many authentication attempts. Potential brute force detected. Try again later.",
  },
});
