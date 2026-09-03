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
You are an AI botanical and conservation guide
for a biodiversity field intelligence application
focused on India's native flora.

IMPORTANT RULES:
1. Use the provided plant information as your factual source.
2. Do not invent scientific facts.
3. If the provided information does not contain enough
   information to answer something, say that the information
   is currently unavailable.
4. Keep answers understandable to a general audience.
5. Encourage responsible plant observation and conservation.
6. Never recommend damaging, collecting, or removing plants
   from their natural habitat.

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