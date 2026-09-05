"use client";

import Link from "next/link";
import { Plant } from "@/types/plant";
import { Leaf, Globe, ShieldAlert, Sparkles, X, Trophy, ExternalLink } from "lucide-react";

interface AROverlayProps {
  plant: Plant;
  onClose?: () => void;
  xpEarned?: number;
}

export function AROverlay({ plant, onClose, xpEarned = 100 }: AROverlayProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-5 animate-reveal-in">
      {/* Top HUD: XP Badge & Close Button */}
      <div className="flex items-center justify-between w-full">
        <div className="pointer-events-auto backdrop-blur-md bg-emerald-950/40 border border-emerald-400/50 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-emerald-300 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-bounce">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>+{xpEarned} XP GAINED</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="pointer-events-auto backdrop-blur-md bg-black/40 border border-white/30 text-white hover:bg-white/20 rounded-full p-2 transition-all active:scale-95 shadow-lg"
            aria-label="Close AR view"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center AR Target Tracker */}
      <div className="relative self-center h-36 w-36 sm:h-44 sm:w-44 border-2 border-dashed border-emerald-400/80 rounded-full flex items-center justify-center animate-pulse pointer-events-none">
        <div className="h-3 w-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-emerald-300 uppercase backdrop-blur-md bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-400/50 shadow-md">
          {plant.scientificName}
        </div>
      </div>

      {/* Transparent Liquid Glass Flash Card */}
      <div className="pointer-events-auto backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl p-4 sm:p-5 text-white space-y-3 backdrop-saturate-150 transition-all">
        {/* Card Header */}
        <div className="flex justify-between items-start border-b border-white/15 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-extrabold tracking-tight text-white drop-shadow-sm">
                {plant.commonName}
              </h2>
            </div>
            <p className="text-xs italic text-zinc-300 mt-0.5">{plant.scientificName}</p>
          </div>
          <span className="backdrop-blur-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            {plant.family}
          </span>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="backdrop-blur-md bg-black/25 p-2.5 rounded-2xl border border-white/10">
            <span className="text-zinc-300 flex items-center gap-1 font-semibold text-[10px] uppercase">
              <Globe className="w-3 h-3 text-emerald-400" /> Native Region
            </span>
            <p className="text-white mt-1 font-medium text-xs truncate">
              {plant.nativeRegion} {plant.endemic ? "(Endemic)" : ""}
            </p>
          </div>

          <div className="backdrop-blur-md bg-black/25 p-2.5 rounded-2xl border border-white/10">
            <span className="text-zinc-300 flex items-center gap-1 font-semibold text-[10px] uppercase">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Conservation
            </span>
            <p className="text-white mt-1 font-medium text-xs truncate">
              {plant.conservationStatus}
            </p>
          </div>
        </div>

        {/* Ecological Importance */}
        <div className="backdrop-blur-md bg-black/25 p-2.5 rounded-2xl border border-white/10 text-xs">
          <span className="text-zinc-300 flex items-center gap-1 font-semibold text-[10px] uppercase mb-1">
            <Leaf className="w-3 h-3 text-emerald-400" /> Ecological Role
          </span>
          <p className="text-zinc-200 text-[11px] leading-relaxed line-clamp-2">
            {plant.ecologicalImportance}
          </p>
        </div>

        {/* Action Link to Full Dossier */}
        <div className="pt-1 flex items-center justify-between">
          <Link
            href={`/species/${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md"
          >
            <span>View Full Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}