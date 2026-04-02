import PptxGenJS from "pptxgenjs";
import type { SlideContent } from "./llm";
import path from "path";
import os from "os";

export const compilePPTX = async (
  slideData: SlideContent[],
  audioFiles: string[],
  jobId: string,
  themeType: string
): Promise<string> => {
  try {
    const pres = new PptxGenJS();
    
    const isDark = themeType?.toLowerCase().includes("dark") || true;
    const bgColor = isDark ? "121212" : "F8FAFC";
    const textColor = isDark ? "F8FAFC" : "1E293B";
    const accentColor = "8B5CF6"; // Signature Electric Purple branding

    pres.layout = "LAYOUT_16x9";

    // Build Master Slide layouts dictating consistency
    pres.defineSlideMaster({
      title: "GLOBAL_MASTER",
      background: { color: bgColor },
    });

    slideData.forEach((slide, index) => {
      const pptxSlide = pres.addSlide({ masterName: "GLOBAL_MASTER" });

      if (slide.imageSearchTerm) {
         pptxSlide.background = { 
            path: `https://source.unsplash.com/1280x720/?${encodeURIComponent(slide.imageSearchTerm)}`
         };
      }

      // Embed Title configuration
      pptxSlide.addText(slide.slideTitle, {
        x: 0.5,
        y: 0.5,
        w: "90%",
        h: 1,
        fontSize: 36,
        color: accentColor,
        bold: true,
      });

      // Embed specific Bullet arrays checking native structure
      if (slide.bulletPoints && Array.isArray(slide.bulletPoints)) {
        const bulletConfig = slide.bulletPoints.map((point) => ({
          text: point,
          options: { bullet: true, color: textColor, fontSize: 24, breakLine: true },
        }));

        pptxSlide.addText(bulletConfig, {
          x: 0.5,
          y: 2,
          w: "90%",
          h: "60%",
          valign: "top",
        });
      }

      // Automatically configure the Media components linking local Mp3s generated from node-edge-tts
      if (audioFiles[index]) {
        pptxSlide.addMedia({
          type: "audio",
          path: audioFiles[index],
          x: 0.5,
          y: 6.5,
          w: 0.5,
          h: 0.5,
        });
      }
    });

    const outputPath = path.join(os.tmpdir(), `imaginexplainer_${jobId}.pptx`);
    
    // Write and save the raw presentation locally to Temporal scope sandbox
    await pres.writeFile({ fileName: outputPath });
    
    return outputPath;
  } catch (error) {
    console.error("[Compiler Engine] Pptx assembly execution critically halted:", error);
    throw new Error("Compiler failed internally writing layout geometries.");
  }
};
