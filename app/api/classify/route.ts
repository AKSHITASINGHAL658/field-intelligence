import { NextRequest, NextResponse } from "next/server";
import { retrievePlantContext } from "@/lib/retrieval";
import { ClassificationResult, ClassifyResponse } from "@/types/api";

// This route intentionally does NOT run the ONNX model — inference happens
// client-side in lib/plantClassifier.ts, in the browser (see classifyImage /
// classifyAndIdentify). onnxruntime-web's preprocessing depends on
// document/canvas/Image, which don't exist in a Next.js route handler.
//
// This route's job is downstream of the model: take whatever speciesId the
// browser's classifier produced, and enrich it with the matching plant
// record. Because it looks the ID up by string instead of hardcoding a
// species list, it automatically supports any class_mapping.json /
// plant_classifier.onnx you swap in later — new species just need a matching
// entry added to data/plantDatabase.ts.
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ClassificationResult>;

    if (typeof body.success !== "boolean") {
      return NextResponse.json(
        { error: "Request body must include a boolean 'success' field." },
        { status: 400 }
      );
    }

    // The model ran but didn't reach the confidence threshold (or failed) —
    // pass that through as-is, there's no plant to look up.
    if (!body.success || !body.speciesId) {
      const response: ClassifyResponse = {
        success: false,
        confidence: body.confidence,
        reason:
          body.reason ?? "Classification did not return a confident match.",
      };

      return NextResponse.json(response);
    }

    const plant = retrievePlantContext(body.speciesId);

    if (!plant) {
      // The classifier recognized a class that isn't in the plant database
      // yet — expected right after adding new species to the model until
      // data/plantDatabase.ts is updated to match.
      const response: ClassifyResponse = {
        success: false,
        speciesId: body.speciesId,
        confidence: body.confidence,
        reason: `No plant record found for species "${body.speciesId}".`,
      };

      return NextResponse.json(response, { status: 404 });
    }

    const response: ClassifyResponse = {
      success: true,
      speciesId: body.speciesId,
      confidence: body.confidence,
      reason: body.reason,
      plant,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Classify API error:", error);

    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}