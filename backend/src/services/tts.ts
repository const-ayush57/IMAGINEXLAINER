import { EdgeTTS } from "node-edge-tts";
import path from "path";
import os from "os";

export const generateVoiceover = async (
  scriptText: string,
  voiceName: string,
  fileName: string
): Promise<string> => {
  try {
    // Instantiating the Node wrapper interacting with MS Edge Voices securely
    const tts = new EdgeTTS({
      voice: voiceName || "en-US-AriaNeural", 
    });

    // We sandbox our media compilation files strictly into OS layer temporal directories securing disk access.
    const tempDir = os.tmpdir();
    const outputPath = path.join(tempDir, fileName);

    await tts.ttsPromise(scriptText, outputPath);
    
    return outputPath;
  } catch (error: any) {
    console.error("[TTS Service] node-edge-tts Buffer failure event triggered:", error);
    throw new Error("Failed to capture TTS audio array buffer stream appropriately from service endpoint.");
  }
};
