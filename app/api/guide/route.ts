import { NextRequest, NextResponse } from "next/server";
import { retrievePlantContext } from "@/lib/retrieval";
import { buildPlantContext } from "@/lib/contextbuilder";
import { generateBotanicalAnswer } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { plantId, question } = body;

    if (!plantId || !question) {
      return NextResponse.json(
        {
          error: "plantId and question are required",
        },
        { status: 400 }
      );
    }

    const plant = retrievePlantContext(plantId);

    if (!plant) {
      return NextResponse.json(
        {
          error: "Plant not found",
        },
        { status: 404 }
      );
    }

    const plantContext = buildPlantContext(plant);

    const answer = await generateBotanicalAnswer(
      question,
      plantContext
    );

    return NextResponse.json({
      success: true,
      answer,
      plantId,
    });

  } catch (error) {
  console.error("Guide API error:", error);

  return NextResponse.json(
    {
      error: String(error),
    },
    { status: 500 }
  );
}
}