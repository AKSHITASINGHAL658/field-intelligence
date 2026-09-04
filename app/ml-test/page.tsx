"use client";

import { useState } from "react";
import {
  classifyImage,
  ClassificationResult,
} from "@/lib/plantClassifier";

export default function MLTestPage() {

  const [result, setResult] = useState<ClassificationResult | null>(null);

  async function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = event.target.files?.[0];

    if (!file) return;

    const image = new Image();

    image.src = URL.createObjectURL(file);

    image.onload = async () => {

      const prediction =
        await classifyImage(image);

      setResult(prediction);

      URL.revokeObjectURL(image.src);
    };
  }

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Arial"
      }}
    >

      <h1>
        Plant ML Test
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {result && (
        <pre
          style={{
            marginTop: 30
          }}
        >
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>
      )}

    </main>
  );
}