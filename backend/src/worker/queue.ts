import { Worker } from 'bullmq';
import { redisClient } from '../config/redis';
import { processPresentationJob } from './jobs/presentation';

console.log('[Worker Configuration] Native Processing Daemon initialized resolving Redis commands.');

// Boot the specific Processing Daemon mapping exclusively to background execution servers
export const presentationWorker = new Worker(
  'ImagineXplainerQueue',
  async (job) => {
    // Inject the payload securely into our internal orchestrator pipeline
    await processPresentationJob(job.data);
  },
  { 
      connection: redisClient,
      concurrency: 5 
  }
);
