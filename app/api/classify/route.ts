import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    speciesId: "plant-01",
    confidence: 0.94,
  });
}