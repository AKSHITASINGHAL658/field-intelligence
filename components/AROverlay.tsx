"use client";

import Link from "next/link";
import { Plant } from "@/types/plant";
import { Leaf, Globe, ShieldAlert, Sparkles, X, Trophy, ExternalLink } from "lucide-react";
import { PixelMascot } from "@/components/pixel/PixelMascot";

interface AROverlayProps {
  plant: Plant;
  onClose?: () => void;
  xpEarned?: number;
}

export function AROverlay({ plant, onClose, xpEarned = 100 }: AROverlayProps) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 sm:p-4 font-mono">
      {/* Arcade Top HUD */}
      <div className="flex items-center justify-between w-full">
        {/* Pixel XP Score Badge */}
        <div className="pointer-events-auto bg-black/80 border-4 border-yellow-400 px-3 py-1 flex items-center gap-2 text-yellow-300 text-xs font-bold shadow-[4px_4px_0px_#000000] animate-bounce">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="tracking-widest">+{xpEarned} XP UNLOCKED!</span>
        </div>

        {/* Arcade Exit Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="pointer-events-auto bg-red-600 hover:bg-red-500 border-2 border-black text-white p-1.5 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Close AR view"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        )}
      </div>

      {/* Arcade Crosshair Target Tracker */}
      <div className="relative self-center h-32 w-32 sm:h-40 sm:w-40 border-4 border-dashed border-emerald-400 flex items-center justify-center animate-pulse pointer-events-none">
        <div className="h-4 w-4 bg-emerald-400 border-2 border-black shadow-[0_0_10px_#34d399]" />
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider text-emerald-300 bg-black border-2 border-emerald-400 px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
          {plant.scientificName}
        </div>
      </div>

      {/* Arcade Pixel Flash Card Container */}
      <div className="pointer-events-auto relative bg-black/85 border-4 border-emerald-500 p-3 sm:p-4 text-white space-y-3 shadow-[6px_6px_0px_#000000]">
        
        {/* Floating Side Mascot on Card Header */}
        <div className="absolute -top-7 right-4 animate-bounce [animation-duration:2s]">
          <PixelMascot size={32} expression="happy" />
        </div>

        {/* Card Header */}
        <div className="border-b-2 border-dashed border-emerald-800 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <h2 className="text-base sm:text-lg font-black tracking-wider text-emerald-300 uppercase">
              {plant.commonName}
            </h2>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-[11px] italic text-zinc-400">{plant.scientificName}</p>
            <span className="bg-emerald-950 border border-emerald-400 text-emerald-300 text-[9px] font-bold uppercase px-2 py-0.5">
              {plant.family}
            </span>
          </div>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-[#0c140d] p-2 border-2 border-emerald-900/80">
            <span className="text-emerald-400 flex items-center gap-1 font-bold text-[9px] uppercase">
              <Globe className="w-3 h-3 text-emerald-400" /> Native Region
            </span>
            <p className="text-zinc-200 mt-0.5 truncate font-bold">
              {plant.nativeRegion}
            </p>
          </div>

          <div className="bg-[#0c140d] p-2 border-2 border-emerald-900/80">
            <span className="text-emerald-400 flex items-center gap-1 font-bold text-[9px] uppercase">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Status
            </span>
            <p className="text-zinc-200 mt-0.5 truncate font-bold">
              {plant.conservationStatus}
            </p>
          </div>
        </div>

        {/* Ecological Importance */}
        <div className="bg-[#0c140d] p-2 border-2 border-emerald-900/80 text-[10px]">
          <span className="text-emerald-400 flex items-center gap-1 font-bold text-[9px] uppercase mb-0.5">
            <Leaf className="w-3 h-3 text-emerald-400" /> Role
          </span>
          <p className="text-zinc-300 line-clamp-2 leading-snug">
            {plant.ecologicalImportance}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-0.5">
          <Link
            href={`/species/${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 border-2 border-black text-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>OPEN SPECIES DOSSIER</span>
            <ExternalLink className="w-3 h-3 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
}