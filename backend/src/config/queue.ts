import { Queue } from 'bullmq';
import { redisClient } from './redis';

// Isolated mapping of the Queue strictly for the Express API injection payload.
// This ensures that API containers never accidentally boot up Background Processing logic natively.
export const presentationQueue = new Queue('ImagineXplainerQueue', {
    connection: redisClient
});
