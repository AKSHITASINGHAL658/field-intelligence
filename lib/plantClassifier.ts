import * as ort from "onnxruntime-web";

export interface ClassificationResult {
  success: boolean;
  speciesId?: string;
  confidence?: number;
  reason?: string;
}

// --- Model-specific config -------------------------------------------------
// These describe the CNN's fixed input contract. If you retrain with a
// different input resolution or normalization, update them here — this is
// the only place they're defined.
const MODEL_URL = "/models/plant_classifier.onnx";
const CLASS_MAPPING_URL = "/models/class_mapping.json";
const INPUT_SIZE = 224;
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

// Confidence bands — business logic, independent of the model itself.
const MIN_CONFIDENCE = 0.6;
const HIGH_CONFIDENCE = 0.8;

// --- Cached, lazily-loaded model state --------------------------------------
// Everything here is derived from the files in /public/models at load time,
// so swapping in a retrained plant_classifier.onnx + class_mapping.json
// (more classes, different species, different node names) just works
// without touching this file.
let session: ort.InferenceSession | null = null;
let classMapping: string[] | null = null;
let inputName: string | null = null;
let outputName: string | null = null;

async function loadClassMapping(): Promise<string[]> {
  if (classMapping) return classMapping;

  const response = await fetch(CLASS_MAPPING_URL);

  if (!response.ok) {
    throw new Error(
      `Could not load class_mapping.json (${response.status}). ` +
        "Make sure it's present in /public/models."
    );
  }

  const raw = (await response.json()) as Record<string, string>;

  // class_mapping.json is keyed by class index ("0", "1", ...). Sort
  // numerically so index N in the array lines up with output index N,
  // regardless of key insertion order or how many classes exist.
  classMapping = Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => raw[key]);

  return classMapping;
}

async function getSession(): Promise<ort.InferenceSession> {
  if (session && inputName && outputName) {
    return session;
  }

  session = await ort.InferenceSession.create(MODEL_URL);

  // Read the I/O node names from the model itself instead of assuming
  // "input"/"output" — a retrained or re-exported model can name these
  // differently.
  inputName = session.inputNames[0];
  outputName = session.outputNames[0];

  if (!inputName || !outputName) {
    throw new Error(
      "Model has no declared input/output names — check the ONNX export."
    );
  }

  return session;
}

// CanvasImageSource covers <img>, <video>, and <canvas> — so a live camera
// frame (video element) or a captured still (canvas) can be classified
// directly, with no need to round-trip through an <img>.
export async function classifyImage(
  image: CanvasImageSource
): Promise<ClassificationResult> {
  try {
    const canvas = document.createElement("canvas");

    canvas.width = INPUT_SIZE;
    canvas.height = INPUT_SIZE;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return {
        success: false,
        reason: "Could not process image.",
      };
    }

    ctx.drawImage(image, 0, 0, INPUT_SIZE, INPUT_SIZE);

    const imageData = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);

    const input = new Float32Array(1 * 3 * INPUT_SIZE * INPUT_SIZE);

    for (let y = 0; y < INPUT_SIZE; y++) {
      for (let x = 0; x < INPUT_SIZE; x++) {
        const pixelIndex = (y * INPUT_SIZE + x) * 4;

        const r = imageData.data[pixelIndex] / 255;
        const g = imageData.data[pixelIndex + 1] / 255;
        const b = imageData.data[pixelIndex + 2] / 255;

        const index = y * INPUT_SIZE + x;
        const plane = INPUT_SIZE * INPUT_SIZE;

        input[index] = (r - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
        input[plane + index] = (g - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
        input[2 * plane + index] = (b - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
      }
    }

    const tensor = new ort.Tensor("float32", input, [
      1,
      3,
      INPUT_SIZE,
      INPUT_SIZE,
    ]);

    const [model, mapping] = await Promise.all([
      getSession(),
      loadClassMapping(),
    ]);

    const results = await model.run({ [inputName as string]: tensor });

    const output = results[outputName as string].data as Float32Array;

    if (output.length !== mapping.length) {
      // The model and class_mapping.json disagree on the number of
      // classes — almost always means one was updated without the other.
      console.error(
        `Model outputs ${output.length} classes but class_mapping.json ` +
          `defines ${mapping.length}. Regenerate class_mapping.json to ` +
          "match the trained model."
      );

      return {
        success: false,
        reason:
          "Model configuration mismatch. Please try again later or contact support.",
      };
    }

    // Softmax
    const expValues = Array.from(output).map((value) => Math.exp(value));
    const sum = expValues.reduce((a, b) => a + b, 0);
    const probabilities = expValues.map((value) => value / sum);

    let bestIndex = 0;

    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > probabilities[bestIndex]) {
        bestIndex = i;
      }
    }

    const confidence = probabilities[bestIndex];
    const speciesId = mapping[bestIndex];

    if (confidence < MIN_CONFIDENCE) {
      return {
        success: false,
        confidence,
        reason: "Low-confidence match. Please capture the plant more clearly.",
      };
    }

    return {
      success: true,
      speciesId,
      confidence,
      reason:
        confidence >= HIGH_CONFIDENCE
          ? "High-confidence visual match"
          : "Moderate-confidence visual match",
    };
  } catch (error) {
    console.error("Classification error:", error);

    return {
      success: false,
      reason: "Unable to classify the image.",
    };
  }
}

/**
 * Full end-to-end flow used by the app: run the model in the browser,
 * then hand the result to /api/classify, which looks up the matching
 * plant record and returns it alongside the raw classification.
 *
 * This is the function UI code (e.g. the scanner page) should call.
 */
export async function classifyAndIdentify(image: CanvasImageSource) {
  const classification = await classifyImage(image);

  const response = await fetch("/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classification),
  });

  const data = await response.json();

  if (!response.ok && response.status !== 404) {
    throw new Error(data.error ?? "Classification request failed.");
  }

  return data;
}