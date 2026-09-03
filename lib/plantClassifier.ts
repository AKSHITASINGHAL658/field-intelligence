import * as ort from "onnxruntime-web";

export interface ClassificationResult {
  success: boolean;
  speciesId?: string;
  confidence?: number;
  reason?: string;
}

let session: ort.InferenceSession | null = null;

const classMapping = [
  "plant-01",
  "plant-02",
  "plant-03",
  "plant-04",
  "plant-05",
  "plant-06",
  "plant-07",
];

async function getSession() {
  if (!session) {
    session = await ort.InferenceSession.create(
      "/models/plant_classifier.onnx"
    );
  }

  return session;
}

export async function classifyImage(
  image: HTMLImageElement
): Promise<ClassificationResult> {

  try {
    const canvas = document.createElement("canvas");

    canvas.width = 224;
    canvas.height = 224;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return {
        success: false,
        reason: "Could not process image.",
      };
    }

    ctx.drawImage(
      image,
      0,
      0,
      224,
      224
    );

    const imageData = ctx.getImageData(
      0,
      0,
      224,
      224
    );

    const input = new Float32Array(
      1 * 3 * 224 * 224
    );

    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let y = 0; y < 224; y++) {

      for (let x = 0; x < 224; x++) {

        const pixelIndex =
          (y * 224 + x) * 4;

        const r =
          imageData.data[pixelIndex] / 255;

        const g =
          imageData.data[pixelIndex + 1] / 255;

        const b =
          imageData.data[pixelIndex + 2] / 255;

        const index =
          y * 224 + x;

        input[index] =
          (r - mean[0]) / std[0];

        input[224 * 224 + index] =
          (g - mean[1]) / std[1];

        input[2 * 224 * 224 + index] =
          (b - mean[2]) / std[2];
      }
    }

    const tensor = new ort.Tensor(
      "float32",
      input,
      [1, 3, 224, 224]
    );

    const model = await getSession();

    const results = await model.run({
      input: tensor,
    });

    const output =
      results.output.data as Float32Array;

    // Softmax
    const expValues = Array.from(output).map(
      value => Math.exp(value)
    );

    const sum = expValues.reduce(
      (a, b) => a + b,
      0
    );

    const probabilities =
      expValues.map(value => value / sum);

    let bestIndex = 0;

    for (let i = 1; i < probabilities.length; i++) {
      if (
        probabilities[i] >
        probabilities[bestIndex]
      ) {
        bestIndex = i;
      }
    }

    const confidence =
      probabilities[bestIndex];

    const speciesId =
      classMapping[bestIndex];

    if (confidence < 0.60) {
      return {
        success: false,
        confidence,
        reason:
          "Low-confidence match. Please capture the plant more clearly.",
      };
    }

    return {
      success: true,
      speciesId,
      confidence,
      reason:
        confidence >= 0.80
          ? "High-confidence visual match"
          : "Moderate-confidence visual match",
    };

  } catch (error) {

    console.error(
      "Classification error:",
      error
    );

    return {
      success: false,
      reason:
        "Unable to classify the image.",
    };
  }
}
