import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    answer: `This is a temporary botanical guide response for ${body.plantId}.`,
  });
}