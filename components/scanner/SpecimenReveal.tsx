"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, RotateCcw, Sparkles } from "lucide-react";
import { Plant } from "@/types/plant";
import { BotanicalPlate } from "../dossier/BotanicalPlate";
import { plants } from "@/data/plantDatabase";

interface SpecimenRevealProps {
  plant: Plant;
  confidence: number;
  isNewDiscovery: boolean;
  userPhotoUrl?: string;
  onScanAnother: () => void;
}

export function SpecimenReveal({
  plant,
  confidence,
  isNewDiscovery,
  userPhotoUrl,
  onScanAnother,
}: SpecimenRevealProps) {
  const catalogIndex = plants.findIndex((p) => p.id === plant.id);
  const specimenNumber = `#${String(catalogIndex !== -1 ? catalogIndex + 1 : 1).padStart(2, "0")}`;
  const expReward = isNewDiscovery ? (plant.endemic ? 150 : 100) : 25;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-mono px-1">
        <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          SPECIMEN IDENTIFIED
        </span>
        <span className="text-zinc-400 bg-[#0C1015] border border-[#1E2732] px-2.5 py-0.5 rounded-full">
          COLLECTION {specimenNumber} / 07
        </span>
      </div>

      {/* Main Specimen Card */}
      <div className="rounded-3xl bg-[#0C1015] border border-emerald-500/30 p-5 shadow-2xl space-y-4">
        {/* Visual Plate */}
        <div className="relative">
          <BotanicalPlate
            plant={plant}
            confidence={confidence}
            customThumbnail={userPhotoUrl}
            className="border-emerald-500/20"
          />

          {/* Discovery Status Pill */}
          {isNewDiscovery ? (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              NEW SPECIES DISCOVERED
            </div>
          ) : (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider">
              REPEAT OBSERVATION
            </div>
          )}
        </div>

        {/* Taxonomic Info */}
        <div className="pt-2 space-y-1 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              SPECIMEN {specimenNumber}
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#141B22] border border-[#1E2732] text-zinc-300">
              {plant.endemic ? "CAMPUS ENDEMIC" : "CAMPUS FLORA"}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">{plant.commonName}</h2>
          <p className="text-sm italic text-zinc-400 font-sans">{plant.scientificName}</p>
        </div>

        {/* 2-Column Meta Specs */}
        <div className="grid grid-cols-2 gap-2 text-left pt-1">
          <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#1E2732]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              FAMILY
            </span>
            <p className="text-xs font-medium text-zinc-200 mt-0.5 truncate">{plant.family}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#1E2732]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              CONSERVATION
            </span>
            <p className="text-xs font-medium text-emerald-400 mt-0.5 truncate flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {plant.conservationStatus}
            </p>
          </div>
        </div>

        {/* Real Model Confidence & Research Reward */}
        <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732] text-left space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 uppercase">MODEL CONFIDENCE</span>
            <span className="text-emerald-400 font-bold">{Math.round(confidence * 100)}%</span>
          </div>

          <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-[#171F28]">
            <span className="text-zinc-500 uppercase">FIELD REWARD</span>
            <span className="text-amber-400 font-bold">+{expReward} FIELD EXP</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          <Link
            href={`/species/${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            Open Full Species Dossier <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={`/guide?plantId=${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141B22] hover:bg-[#1A232D] text-zinc-200 border border-[#1E2732] font-semibold text-xs transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Ask AI Guide About This Plant
          </Link>

          <button
            onClick={onScanAnother}
            className="w-full pt-2 flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            SCAN ANOTHER SPECIMEN
          </button>
        </div>
      </div>
    </div>
  );
}
