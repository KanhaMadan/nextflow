// trigger/llm-task.ts
// Trigger.dev task: calls Google Gemini API for LLM inference

import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface LLMTaskPayload {
  model: string;
  systemPrompt?: string;
  userMessage: string;

  // Array of image URLs for vision support
  images?: string[]; 
}

export interface LLMTaskOutput {
  result: string;
}

export const llmTask = task({
  id: "llm-task",
  // Generous timeout for large prompts / vision requests
  maxDuration: 120,

  run: async (payload: LLMTaskPayload): Promise<LLMTaskOutput> => {
    const { model, systemPrompt, userMessage, images = [] } = payload;

    const geminiModel = genAI.getGenerativeModel({
      model: model ?? "gemini-1.5-flash",
      ...(systemPrompt
        ? { systemInstruction: { role: "system", parts: [{ text: systemPrompt }] } }
        : {}),
    });

    // Building content parts
    const parts: Part[] = [];

    // Adding images first (vision support — multimodal)
    for (const imageUrl of images) {
      try {
        // Fetch the image and convert to base64 for Gemini
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) continue;

        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        // Detect MIME type from URL or default to jpeg
        let mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg";
        const urlLower = imageUrl.toLowerCase();
        if (urlLower.includes(".png")) mimeType = "image/png";
        else if (urlLower.includes(".webp")) mimeType = "image/webp";
        else if (urlLower.includes(".gif")) mimeType = "image/gif";

        parts.push({
          inlineData: {
            mimeType,
            data: base64,
          },
        });
      } catch (err) {
        console.error(`Failed to fetch image ${imageUrl}:`, err);
      }
    }

    // Add text prompt
    parts.push({ text: userMessage });

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return { result: text };
  },
});
