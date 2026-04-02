import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config"; // Ensure variables are loaded

// Connection String strictly requires DATABASE_URL defined in the `.env` file
if (!process.env.DATABASE_URL) {
  throw new Error("CRITICAL: DATABASE_URL environment variable is missing.");
}

// Establish a secure connection pool to PostgreSQL (Neon/Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the Drizzle instance bundled with our strict schema mappings
export const db = drizzle(pool, { schema });

console.log("[Database] Drizzle ORM securely connected to PostgreSQL via connection pool.");
