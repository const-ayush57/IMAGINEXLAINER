import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  jsonb, 
  pgEnum 
} from "drizzle-orm/pg-core";

// Define the Job Status Enum
export const jobStatusEnum = pgEnum("job_status", ["pending", "processing", "completed", "failed"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const presentationJobsTable = pgTable("presentation_jobs", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => usersTable.id),
  topic: text("topic").notNull(),
  theme: varchar("theme", { length: 50 }).default("dark").notNull(),
  voice: varchar("voice", { length: 150 }).notNull(),
  length: varchar("length", { length: 50 }).notNull(),
  
  status: jobStatusEnum("status").default("pending").notNull(), 
  
  // Storing the structured JSON data returned from the Groq LLM (Slides, Titles, Scripts)
  slideData: jsonb("slide_data"), 
  
  // URL or distinct file path to the final downloaded .pptx file 
  fileUrl: text("file_url"), 
  
  // Logs any errors if the BullMQ worker crashes (e.g. Rate Limits, TTS failure)
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
