// components/AROverlay.tsx
"use client";

import React from "react";
import { Plant } from "@/types/plant";
import { Leaf, Globe, ShieldAlert, Sparkles, X } from "lucide-react";

interface AROverlayProps {
  plant: Plant;
  onClose: () => void;
}

export function AROverlay({ plant, onClose }: AROverlayProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-5">
      {/* Top Bar: AR Tracking Indicator & Close Button */}
      <div className="flex items-center justify-between w-full">
        <div className="pointer-events-auto backdrop-blur-md bg-black/60 border border-emerald-500/40 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-emerald-400 text-xs font-semibold shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          AR TARGET LOCKED
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto backdrop-blur-md bg-black/60 border border-white/20 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label="Close AR view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center Target Reticle */}
      <div className="relative self-center h-44 w-44 border-2 border-dashed border-emerald-400/70 rounded-full flex items-center justify-center animate-pulse pointer-events-none">
        <div className="h-2 w-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-emerald-300 uppercase bg-black/80 px-2 py-0.5 rounded border border-emerald-500/30">
          {plant.scientificName}
        </div>
      </div>

      {/* AR HUD Card: Contextual Info Overlay */}
      <div className="pointer-events-auto backdrop-blur-xl bg-zinc-950/85 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-3 transform transition-all duration-300">
        {/* Names & Plant Family */}
        <div className="flex justify-between items-start border-b border-zinc-800 pb-2.5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {plant.commonName}
            </h2>
            <p className="text-xs italic text-zinc-400 mt-0.5">{plant.scientificName}</p>
          </div>
          <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {plant.family}
          </span>
        </div>

        {/* Native Region & Conservation Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1 font-medium text-[10px] uppercase tracking-wider">
              <Globe className="w-3 h-3 text-emerald-400" /> Native Region
            </span>
            <p className="text-zinc-200 mt-1 font-medium text-xs truncate">
              {plant.nativeRegion} {plant.endemic ? "(Endemic)" : ""}
            </p>
          </div>

          <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 flex items-center gap-1 font-medium text-[10px] uppercase tracking-wider">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Conservation
            </span>
            <p className="text-zinc-200 mt-1 font-medium text-xs truncate">
              {plant.conservationStatus}
            </p>
          </div>
        </div>

        {/* Ecological Importance */}
        <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/80 text-xs">
          <span className="text-zinc-500 flex items-center gap-1 font-medium text-[10px] uppercase tracking-wider mb-1">
            <Leaf className="w-3 h-3 text-emerald-400" /> Ecological Importance
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-3">
            {plant.ecologicalImportance}
          </p>
        </div>
      </div>
    </div>
  );
}