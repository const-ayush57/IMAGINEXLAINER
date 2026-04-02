import { db } from "../../db";
import { presentationJobsTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { generatePresentationContent } from "../../services/llm";
import { generateVoiceover } from "../../services/tts";
import { compilePPTX } from "../../services/pptx";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

import { search } from "duck-duck-scrape";
import path from "path";
import os from "os";

interface Payload {
  jobId: number;
  topic: string;
  theme: string;
  voice: string;
  length: string;
  type: string;
  useImages: boolean;
  webSearch: boolean;
  speakers: number;
}

export const processPresentationJob = async (jobPayload: Payload) => {
  const { jobId, topic, theme, voice, length, type, useImages, webSearch, speakers } = jobPayload;
  let audioFilePaths: string[] = [];
  let compileLocation: string | null = null;
  let webSearchContext = "";

  try {
    // 1. Hook state strictly modifying Postgres Enum configurations to PROCESSING mapping the UI frontend tracking
    await db
      .update(presentationJobsTable)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(presentationJobsTable.id, jobId));

    if (webSearch) {
       console.log(`[Queue - Job ${jobId}] Triggering DuckDuckScrape extraction natively masking IPs...`);
       try {
           const searchResults = await search(topic);
           webSearchContext = searchResults.results.slice(0, 3).map(r => r.description).join("\n");
       } catch (searchErr) {
           console.log(`[Search Warning] Scraper failed routing seamlessly fallback:`, searchErr);
       }
    }

    console.log(`[Queue - Job ${jobId}] Initializing LLM execution phase securely via Native Fetch...`);
    
    // 2. Fetch LLM Array Payload blocking async
    const slides = await generatePresentationContent(
       topic, 
       length, 
       theme, 
       speakers, 
       type === 'video' ? useImages : false, 
       webSearchContext
    );

    // Persist mapped JSONB objects internally to the database
    await db
      .update(presentationJobsTable)
      .set({ slideData: slides as any })
      .where(eq(presentationJobsTable.id, jobId));

    console.log(`[Queue - Job ${jobId}] Iteratively mapping text vectors via TTS Neural Voice endpoints...`);
    
    // 3. Native File streaming into mp3 formats dynamically linked to index array configurations
    for (const [index, slide] of slides.entries()) {
      let activeVoice = voice;
      if (speakers === 2 && slide.speaker === 2) {
         // Dynamically swap the distinct Azure Neural dialect securely
         activeVoice = voice === "en-US-AriaNeural" ? "en-US-GuyNeural" : "en-US-AriaNeural"; 
      }

      const audioPath = await generateVoiceover(
        slide.speakerScript, 
        activeVoice, 
        `${jobId}_slide_${index}_${uuidv4()}.mp3`
      );
      audioFilePaths.push(audioPath);
    }

    // Podcast Dynamic Skip Branch securely mapped
    if (type === 'podcast') {
       console.log(`[Queue - Job ${jobId}] Assembling podcast MP3 natively skipping PPTX CloudConvert...`);
       const finalMp3Path = path.join(os.tmpdir(), `imaginexplainer_${jobId}_final.mp3`);
       
       // Because node-edge-tts creates uniform MP3s without complex headers natively, Buffer Array concat maps 1:1
       const nativeFS = require('fs').promises;
       const buffers = await Promise.all(audioFilePaths.map(p => nativeFS.readFile(p)));
       await nativeFS.writeFile(finalMp3Path, Buffer.concat(buffers));
       
       await db
         .update(presentationJobsTable)
         .set({ status: "completed", fileUrl: finalMp3Path, updatedAt: new Date() })
         .where(eq(presentationJobsTable.id, jobId));
         
       console.log(`[Queue] Audio Payload rendering successful for Secret MP3 Sequence [${jobId}]`);
       return; // Gracefully terminate execution sequence here!
    }

    console.log(`[Queue - Job ${jobId}] Launching native PPTX geometric compilation process...`);
    
    // 4. Native Assembly (Standard PPTX Generation)
    const pptxLocation = await compilePPTX(slides, audioFilePaths, String(jobId), theme);
    
    console.log(`[Queue - Job ${jobId}] Initializing secret CloudConvert stealth video rendering pipeline...`);

    // 5. CloudConvert Secret Rendering!
    const CloudConvert = require('cloudconvert');
    const cloudconvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY!);
    
    const job = await cloudconvert.jobs.create({
        tasks: {
            'upload-pptx': {
                operation: 'import/upload'
            },
            'convert-to-mp4': {
                operation: 'convert',
                input: 'upload-pptx',
                output_format: 'mp4',
                video_resolution: "1920x1080",
                fps: 30
            },
            'export-mp4': {
                operation: 'export/url',
                input: 'convert-to-mp4'
            }
        }
    });

    // Extract import task and upload Native file
    const uploadTask = job.tasks.find((task: any) => task.name === 'upload-pptx');
    const fileName = pptxLocation.split('/').pop() || pptxLocation.split('\\').pop() || 'temp.pptx';
    
    // Node.js fs implementation required by CloudConvert SDK
    const fsNative = require('fs');
    await cloudconvert.tasks.upload(uploadTask, fsNative.createReadStream(pptxLocation), fileName);

    // Block asynchronously polling the execution server cluster mapping
    console.log(`[Queue - Job ${jobId}] Waiting for CloudConvert distributed MP4 composition...`);
    const completedJob = await cloudconvert.jobs.wait(job.id);

    // Retrieve and structurally assign export payload arrays
    const exportTask = completedJob.tasks.find((task: any) => task.name === 'export-mp4' && task.status === 'finished');
    if (!exportTask) throw new Error("CloudConvert explicitly bypassed export geometries fatally.");
    
    const filePayload = exportTask.result.files[0];
    
    console.log(`[Queue - Job ${jobId}] Downloading encoded ${filePayload.filename}...`);
    const mp4Response = await fetch(filePayload.url);
    const mp4Buffer = await mp4Response.arrayBuffer();
    
    const mp4Location = pptxLocation.replace('.pptx', '.mp4');
    await fs.writeFile(mp4Location, Buffer.from(mp4Buffer));

    // Garbage collector immediately executes Native scrubbing of original PPTX!
    await fs.unlink(pptxLocation);
    console.log(`[Queue - Job ${jobId}] Original PPTX safely stripped natively.`);

    // 6. Final State Transition
    await db
      .update(presentationJobsTable)
      .set({ 
        status: "completed", 
        fileUrl: mp4Location,
        updatedAt: new Date() 
      })
      .where(eq(presentationJobsTable.id, jobId));

    console.log(`[Queue] AI Payload rendering successful for Secret MP4 Sequence [${jobId}]`);
    
  } catch (error: any) {
    console.error(`[Queue - CRITICAL ERROR] Fatally crashed building Job ${jobId}:`, error);
    
    // Exception Handlers gracefully updating Postgres schemas explicitly returning user payload context
    await db
      .update(presentationJobsTable)
      .set({ 
        status: "failed", 
        errorMessage: String(error.message || "Unknown Job Compilation Crash."),
        updatedAt: new Date() 
      })
      .where(eq(presentationJobsTable.id, jobId));
      
  } finally {
    // SECURITY HANDLER: A strict closure ensuring native fs.unlink cleanly scrubs local file paths
    console.log(`[Queue Worker] Garbage collector executing native \`unlink\` tracking ${audioFilePaths.length} objects.`);
    for (const path of audioFilePaths) {
      try {
        await fs.unlink(path);
      } catch (e) {
        console.error(`[MEMORY NOTIFICATION] Leak deteced wiping temp tracking path: ${path}`, e);
      }
    }
  }
};
