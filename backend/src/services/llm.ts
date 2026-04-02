import "dotenv/config";

// Secure Force Native Fetch API Mandate enforcing no Axios leakage globally.
const groqApiKey = process.env.GROQ_API_KEY;

export interface SlideContent {
  slideTitle: string;
  bulletPoints: string[];
  speakerScript: string;
  imageSearchTerm?: string;
  speaker?: number;
}

export const generatePresentationContent = async (
  topic: string,
  length: string,
  theme: string,
  speakers: number = 1,
  useImages: boolean = false,
  webSearchContext: string = ""
): Promise<SlideContent[]> => {
  if (!groqApiKey) {
    throw new Error("CRITICAL: GROQ_API_KEY environment configuration is missing.");
  }

  const extraContext = webSearchContext ? `\nCRITICAL CONTEXT (Use these real-time web facts to ground your script):\n${webSearchContext}\n` : "";

  const prompt = `You are an expert presentation generator. Generate a compelling script about: "${topic}".
  The style should be oriented towards a "${theme}" vibe.
  The length of the presentation must be roughly oriented towards a "${length}" format.
  ${speakers === 2 ? "Write the speakerScript as a highly engaging conversational dialogue between 2 podcast co-hosts." : ""}
  ${extraContext}
  You MUST return ONLY a strictly typed JSON array matching this exact signature:
  [
    {
      "slideTitle": "string",
      "bulletPoints": ["point 1", "point 2", "point 3"],
      "speakerScript": "The detailed spoken script for this section. Write vividly.",
      ${useImages ? '"imageSearchTerm": "1-3 concise keywords describing the slide visual background",' : ''}
      ${speakers === 2 ? '"speaker": 1 or 2 (an integer alternately mapping the logical conversation layout)' : '"speaker": 1'}
    }
  ]
  Do not wrap the JSON in markdown blocks like \`\`\`json. Return bare JSON. Ensure bulletPoints are concise arrays of strings, and speakerScript reads conversationally.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // We default to Groq's high-memory extremely fast open source runner
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7, // Encouraging slightly conversational tone natively
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq Execution Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;
    
    // Safety unwrap replacing potential Markdown code snippet wrapping
    let cleanJson = rawContent?.trim() || "[]";
    if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/```/g, "").trim();
    }

    return JSON.parse(cleanJson) as SlideContent[];

  } catch (error: any) {
    console.error(`[LLM Service - Native] Failed inference pipeline:`, error);
    throw new Error("The LLM native core generator failed. Potentially rate-limited or ill-formatted JSON outputs.");
  }
};
