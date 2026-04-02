import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  jsonb, 
  pgEnum,
  integer,
  boolean
} from "drizzle-orm/pg-core";

// Define the Job Status Enum
export const jobStatusEnum = pgEnum("job_status", ["pending", "processing", "completed", "failed"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("none").notNull(),
  credits: integer("credits").default(0).notNull(),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  onboardingData: jsonb("onboarding_data"),
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
  
  slideData: jsonb("slide_data"), 
  fileUrl: text("file_url"), 
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
