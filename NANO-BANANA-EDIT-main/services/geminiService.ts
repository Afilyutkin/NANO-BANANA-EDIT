import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Retrieves the API key from localStorage
 */
const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('NANO_BANANA_API_KEY') || '';
  }
  return '';
};

/**
 * Generates content using Gemini 2.5 Flash Image.
 * Supports both text-only prompts (generation) and multimodal prompts (editing).
 */
export const generateContent = async (
  prompt: string,
  base64Images: string[] = [],
  systemInstruction?: string
): Promise<string> => {
  try {
    // Get API key from localStorage
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error("MISSING_API_KEY");
    }

    // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [];
    
    // Add images to the request parts
    for (const base64Str of base64Images) {
        // Extract mime type and clean base64 data if present
        const match = base64Str.match(/^data:(image\/\w+);base64,(.+)$/);
        let mimeType = 'image/jpeg'; // Default fallback
        let data = base64Str;

        if (match) {
            mimeType = match[1];
            data = match[2];
        }
        
        parts.push({
            inlineData: {
                data: data,
                mimeType: mimeType,
            },
        });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    const config: any = {};
    if (systemInstruction) {
        config.systemInstruction = systemInstruction;
    }

    // Call generateContent for text and image tasks with Gemini models
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: config,
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned from Gemini.");
    }

    const content = candidates[0].content;
    
    // Iterate through all parts to find the image part as per guidelines
    if (content.parts) {
        for (const part of content.parts) {
            if (part.inlineData && part.inlineData.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                return `data:${mime};base64,${part.inlineData.data}`;
            }
        }
    }

    // Use .text property for string output as per guidelines
    if (response.text) {
        console.warn("Gemini returned text instead of image:", response.text);
        throw new Error(`Gemini returned text: ${response.text}`);
    }

    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};