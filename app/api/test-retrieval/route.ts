import { NextResponse } from "next/server";
import { retrievePlantContext } from "@/lib/retrieval";
import { buildPlantContext } from "@/lib/contextbuilder";

export async function GET() {
  const plant = retrievePlantContext("plant-01");

  if (!plant) {
    return NextResponse.json(
      { error: "Plant not found" },
      { status: 404 }
    );
  }

  const context = buildPlantContext(plant);

  return NextResponse.json({
    success: true,
    context
  });
}