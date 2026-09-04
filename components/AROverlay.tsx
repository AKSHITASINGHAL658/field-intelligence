// components/AROverlay.tsx
"use client";

import { Plant } from "@/types/plant";
import { Leaf, Globe, ShieldAlert, Sparkles, X, Trophy } from "lucide-react";

interface AROverlayProps {
  plant: Plant;
  onClose?: () => void;
  xpEarned?: number;
}

export function AROverlay({ plant, onClose, xpEarned = 100 }: AROverlayProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-5">
      {/* Top Bar: AR Tracking Indicator & XP Badge */}
      <div className="flex items-center justify-between w-full">
        <div className="pointer-events-auto backdrop-blur-md bg-black/70 border border-emerald-500/50 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-emerald-400 text-xs font-bold shadow-xl animate-bounce">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>+{xpEarned} XP GAINED</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="pointer-events-auto backdrop-blur-md bg-black/70 border border-white/20 text-white hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label="Close AR view"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center Reticle */}
      <div className="relative self-center h-44 w-44 border-2 border-dashed border-emerald-400/80 rounded-full flex items-center justify-center animate-pulse pointer-events-none">
        <div className="h-2.5 w-2.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-emerald-300 uppercase bg-black/90 px-2 py-0.5 rounded-full border border-emerald-500/40">
          {plant.scientificName}
        </div>
      </div>

      {/* Gamified HUD Specs Card */}
      <div className="pointer-events-auto backdrop-blur-2xl bg-zinc-950/90 border border-emerald-500/40 rounded-2xl p-4 text-white shadow-2xl space-y-3 transform transition-all">
        <div className="flex justify-between items-start border-b border-zinc-800/80 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-extrabold tracking-tight text-emerald-400">
                {plant.commonName}
              </h2>
            </div>
            <p className="text-xs italic text-zinc-400 mt-0.5">{plant.scientificName}</p>
          </div>
          <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {plant.family}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 flex items-center gap-1 font-semibold text-[10px] uppercase">
              <Globe className="w-3 h-3 text-emerald-400" /> Native Region
            </span>
            <p className="text-zinc-200 mt-1 font-medium text-xs truncate">
              {plant.nativeRegion} {plant.endemic ? "(Endemic)" : ""}
            </p>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 flex items-center gap-1 font-semibold text-[10px] uppercase">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Conservation
            </span>
            <p className="text-zinc-200 mt-1 font-medium text-xs truncate">
              {plant.conservationStatus}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 text-xs">
          <span className="text-zinc-500 flex items-center gap-1 font-semibold text-[10px] uppercase mb-1">
            <Leaf className="w-3 h-3 text-emerald-400" /> Ecological Role
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-2">
            {plant.ecologicalImportance}
          </p>
        </div>
      </div>
    </div>
  );
}