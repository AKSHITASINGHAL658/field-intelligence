import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateBotanicalAnswer(
  question: string,
  plantContext: string
) {
  const prompt = `
You are an AI botanical and conservation guide for a biodiversity field intelligence application focused on India's native flora.

IMPORTANT RULES:
1. Anchor in Provided Data: Use the VERIFIED PLANT CONTEXT as the foundation of your answer. Never contradict this data.
2. Expand with Expertise: Use your general botanical and ecological knowledge to elaborate on the provided data. For example, you may explain the plant's family characteristics, delve into the nature of its toxicity, or describe its broader role in the scrubland ecosystem.
3. No Hallucinations: Do not invent scientific facts or characteristics. If a highly specific local detail is asked that you cannot verify, politely state that it's beyond your current data.
4. Accessible Tone: Keep answers engaging, educational, and understandable to a general audience. Avoid overly dense academic jargon without explanation.
5. Conservation First: Encourage responsible plant observation. Never recommend damaging, foraging, collecting, or removing plants from their natural habitat. 
6. Safety Warning: If a plant is marked as toxic, prominently emphasize the danger of ingestion or handling.


VERIFIED PLANT CONTEXT:
${plantContext}

USER QUESTION:
${question}

Answer the user's question clearly and concisely.
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
  });

  return interaction.output_text;
}