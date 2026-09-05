"use client";

import React from "react";
import Image from "next/image";
import { Cpu, Sparkles } from "lucide-react";
import { Plant } from "@/types/plant";

interface BotanicalPlateProps {
  plant: Plant;
  confidence?: number;
  customThumbnail?: string;
  className?: string;
}

export function BotanicalPlate({
  plant,
  confidence,
  customThumbnail,
  className = "",
}: BotanicalPlateProps) {
  const [imageError, setImageError] = React.useState(false);

  // If user captured their own photo during scanning, use it!
  const displaySrc = customThumbnail || plant.image;

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0C1015] border border-[#1E2732] flex items-center justify-center ${className}`}
    >
      {/* Real Image or Diagrammatic Illustration Fallback */}
      {!imageError && displaySrc ? (
        <Image
          src={displaySrc}
          alt={plant.commonName}
          fill
          unoptimized
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Scientific Botanical Line-Art Diagrammatic Plate */
        <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-3 w-full h-full bg-gradient-to-b from-[#0F1722] to-[#080D12]">
          <svg
            className="w-24 h-24 text-emerald-500/60"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Diagrammatic Botanical Line Art */}
            <path d="M50 90 L50 20" strokeLinecap="round" />
            <path
              d="M50 70 C40 60 25 65 20 50 C35 48 45 58 50 70 Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <path
              d="M50 55 C60 45 75 50 80 35 C65 33 55 43 50 55 Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <path
              d="M50 40 C40 30 30 35 25 20 C40 18 48 28 50 40 Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <circle cx="50" cy="20" r="4" fill="currentColor" fillOpacity="0.4" />
          </svg>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
              Botanical Illustration Plate
            </span>
            <p className="text-xs text-zinc-400 font-sans">{plant.scientificName}</p>
          </div>
        </div>
      )}

      {/* Real Classifier Confidence Badge (Rendered only when coming from active ONNX result) */}
      {confidence !== undefined && (
        <div className="absolute top-3 left-3 bg-[#06080A]/90 backdrop-blur-md border border-emerald-500/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 shadow-lg">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>CLASSIFIER (ONNX) {Math.round(confidence * 100)}% CONF</span>
        </div>
      )}

      {/* Endemic status watermark if applicable */}
      {plant.endemic && (
        <div className="absolute bottom-3 right-3 bg-[#06080A]/90 backdrop-blur-md border border-amber-500/40 rounded-lg px-2 py-0.5 flex items-center gap-1 text-[10px] font-mono text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>ENDEMIC</span>
        </div>
      )}
    </div>
  );
}
