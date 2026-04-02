import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { presentationJobsTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../../middleware/auth";
import { presentationQueue } from "../../config/queue";

export const presentationRouter = Router();

// Zod Type checking ensuring payload strictness before DB commits
const generateSchema = z.object({
  topic: z.string().min(3).max(500),
  theme: z.enum(["Light Corporate", "Dark Mode Matrix", "Playful Colorful", "Minimalist"]).default("Dark Mode Matrix"),
  length: z.enum(["Short (5 Slides)", "Medium (10 Slides)", "Detailed (15 Slides)"]).default("Short (5 Slides)"),
  voice: z.string().default("en-US-AriaNeural"), 
  type: z.enum(["video", "podcast"]).default("video"),
  useImages: z.boolean().default(true),
  webSearch: z.boolean().default(false),
  speakers: z.number().default(1)
});

// POST /api/generate Layer Integration
presentationRouter.post("/generate", requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const payload = generateSchema.parse(req.body);

    // 1. Establish initial status marker natively directly routing Drizzle to Postgres
    const [newJob] = await db.insert(presentationJobsTable).values({
      userId,
      topic: payload.topic,
      theme: payload.theme,
      length: payload.length,
      voice: payload.voice,
      status: "pending",
    }).returning();

    // 2. Offload synchronously to BullMQ daemon array
    await presentationQueue.add('compile-pptx', {
      jobId: newJob.id,
      ...payload
    }, {
      removeOnComplete: true, 
      attempts: 0 
    });

    res.status(202).json({ 
        message: "Job dispatched securely.",
        jobId: newJob.id 
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(`[API Generation] Route Synchronization Crash:`, err);
    res.status(500).json({ error: "Failed to queue presentation dynamically natively." });
  }
});

// GET /api/jobs/:id/stream - Server-Sent Events Tracking Realtime Statuses
presentationRouter.get("/jobs/:id/stream", requireAuth, async (req: any, res: any) => {
  const jobId = parseInt(req.params.id, 10);
  if (isNaN(jobId)) {
    return res.status(400).json({ error: "Invalid Schema Job ID Context" });
  }

  // Assign SSE headers natively executing the 0-polling unidirectional pipeline
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  
  // Resolve initial handshake
  res.write(`data: ${JSON.stringify({ status: "connected", jobId })}\n\n`);

  let currentStatus = "";

  const sendUpdate = (payload: any) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const intervalId = setInterval(async () => {
    try {
      // Execute strict Drizzle mapping checking single source of truth across queue worker changes
      const [job] = await db.select().from(presentationJobsTable).where(eq(presentationJobsTable.id, jobId));
      
      if (!job) {
          sendUpdate({ error: "Job context unbound." });
          clearInterval(intervalId);
          res.end();
          return;
      }

      // JWT context bounding ensuring cross-tenant isolation tracking is forbidden
      if (job.userId !== req.user.id) {
          sendUpdate({ error: "Unauthorized tracking access." });
          clearInterval(intervalId);
          res.end();
          return;
      }

      if (job.status !== currentStatus) {
         currentStatus = job.status;
         
         if (job.status === "completed") {
             // Close active sockets routing download links
             sendUpdate({ status: "completed", fileUrl: job.fileUrl });
             clearInterval(intervalId);
             res.end();
         } else if (job.status === "failed") {
             // Stream granular error feedback natively routing the catch block arrays
             sendUpdate({ status: "failed", errorMessage: job.errorMessage });
             clearInterval(intervalId);
             res.end();
         } else {
             // Stream the explicit enum ("pending", "processing") natively
             sendUpdate({ status: job.status });
         }
      } else {
         // Keep-alive heartbeat ensuring AWS/Vercel proxies don't blindly severe connections
         sendUpdate({ heartbeat: true });
      }

    } catch (dbError) {
      console.error("[SSE Tracker] Native Postgres extraction crash:", dbError);
    }
  }, 2500); 

  req.on("close", () => clearInterval(intervalId));
});
