"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Plant } from "@/types/plant";

export function HazardCard({ plant }: { plant: Plant }) {
  // Check if plant is toxic (plant-07 Cleistanthus collinus)
  const isToxic =
    plant.id === "plant-07" ||
    plant.threats.some((t) => t.toLowerCase().includes("toxic")) ||
    plant.identificationClues.some((c) => c.toLowerCase().includes("toxic"));

  if (!isToxic) return null;

  return (
    <div className="rounded-2xl border-l-4 border-l-amber-500 border border-[#1E2732] bg-[#0C1015] p-4 text-zinc-200 shadow-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            BIOHAZARD & PHARMACO-TOXICITY
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
          HIGH TOXICITY WARNING
        </span>
      </div>
      <p className="text-xs font-sans text-zinc-300 leading-relaxed">
        All anatomical parts of this taxon (leaves, bark, capsules, and sap) are severely toxic.
        Do not ingest or forage. Wash hands thoroughly if contact occurs during botanical field
        observation.
      </p>
    </div>
  );
}
