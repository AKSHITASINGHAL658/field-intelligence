"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Lock } from "lucide-react";
import { Plant } from "@/types/plant";
import { PixelPlantIcon, PixelIconType } from "../pixel/PixelPlantIcon";
import { PixelFrame } from "../pixel/PixelFrame";
import { useTilt } from "../motion/useTilt";

interface SpecimenCardProps {
  plant: Plant;
  index: number;
  isDiscovered: boolean;
  observationCount?: number;
  customThumbnail?: string;
}

// Map plant families/types to representative pixel icons
function getPlantPixelType(plant: Plant): PixelIconType {
  const name = plant.commonName.toLowerCase();
  if (name.includes("fern")) return "fern";
  if (name.includes("trillium")) return "trillium";
  if (name.includes("rose") || name.includes("plumeria")) return "rose";
  if (name.includes("palm")) return "palm";
  return "leaf";
}

export function SpecimenCard({
  plant,
  index,
  isDiscovered,
  observationCount,
  customThumbnail,
}: SpecimenCardProps) {
  const specimenNumber = `#${String(index + 1).padStart(2, "0")}`;
  const pixelType = getPlantPixelType(plant);
  const [hovering, setHovering] = useState(false);
  // Attached to a plain host <div>, not <Link> — Link's ref forwarding
  // wasn't populating ref.current before effects ran in this Next version
  // (verified directly). React prop-based mouse handlers, not an
  // addEventListener effect, so it isn't sensitive to that either.
  const { ref: tiltRef, onMouseMove: onTiltMove, onMouseLeave: onTiltLeave } = useTilt<HTMLDivElement>(3, 4);

  // The accent only ever reflects a real database field (endemic) — never
  // an invented "rarity" tier.
  const accentTone = plant.endemic ? "amber" : "emerald";

  // Below md: compact horizontal row (list). At md+: a taller vertical card
  // with a bigger image area, suited to a grid of cards instead of a list.
  if (isDiscovered) {
    return (
      <div
        ref={tiltRef}
        onMouseMove={onTiltMove}
        onMouseLeave={onTiltLeave}
        className={`group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C1015] border transition-colors duration-200 active:scale-[0.98] md:flex-col md:items-stretch md:gap-0 md:p-0 md:overflow-hidden ${
          accentTone === "amber"
            ? "border-amber-500/30 hover:border-amber-400/60"
            : "border-[#1E2732] hover:border-emerald-500/50"
        } hover:bg-[#111720] md:hover:shadow-xl md:hover:shadow-black/40`}
      >
      <Link
        href={`/species/${plant.id}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="contents"
      >
        {/* Collectible-card corner framing, only lit up on hover */}
        <PixelFrame
          active={hovering}
          tone={accentTone}
          size={10}
          className={`hidden md:block m-1.5 transition-opacity duration-200 ${
            hovering ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Thumbnail / Botanical Emblem */}
        <div className="relative h-14 w-14 rounded-xl bg-[#141B22] border border-[#1E2732] overflow-hidden flex items-center justify-center flex-shrink-0 md:h-36 md:w-full md:rounded-none md:border-0 md:border-b md:border-[#1E2732]">
          {customThumbnail ? (
            <Image
              src={customThumbnail}
              alt={plant.commonName}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <>
              <span className="md:hidden">
                <PixelPlantIcon type={pixelType} size={28} />
              </span>
              <span className="hidden md:block">
                <PixelPlantIcon type={pixelType} size={56} />
              </span>
            </>
          )}
          <div className="absolute bottom-0 right-0 p-0.5 bg-[#06080A]/80 rounded-tl-md">
            <PixelPlantIcon type={pixelType} size={12} />
          </div>
        </div>

        <div className="min-w-0 md:p-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-zinc-500">
              Specimen {specimenNumber}
            </span>
            <span
              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                accentTone === "amber"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              Discovered
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
            {plant.commonName}
          </h3>
          <p className="text-xs italic text-zinc-400 font-sans">{plant.scientificName}</p>
          {typeof observationCount === "number" && observationCount > 0 && (
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
              Observed {observationCount}×
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors mr-1 md:hidden" />
      </Link>
      </div>
    );
  }

  // Undiscovered / Locked State — pixel silhouette, scanline shimmer, mystery retained
  return (
    <div className="group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#090D11] border border-[#171F28] opacity-65 hover:opacity-85 transition-opacity md:flex-col md:items-stretch md:gap-0 md:p-0 md:overflow-hidden pixel-shimmer">
      <PixelFrame active={false} size={10} className="hidden md:block m-1.5" />
      <div className="h-14 w-14 rounded-xl bg-[#070A0D] border border-[#171F28] flex items-center justify-center flex-shrink-0 text-zinc-600 md:h-36 md:w-full md:rounded-none md:border-0 md:border-b md:border-[#171F28] pixel-scanlines">
        <Lock className="w-5 h-5 md:w-7 md:h-7" />
      </div>

      <div className="min-w-0 md:p-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium text-zinc-600">
            Specimen {specimenNumber}
          </span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
            Undiscovered
          </span>
        </div>
        <h3 className="text-sm font-bold text-zinc-500 mt-0.5">Uncatalogued Taxon</h3>
        <p className="text-xs italic text-zinc-600 font-sans">Habitat: {plant.habitat}</p>
      </div>
    </div>
  );
}
