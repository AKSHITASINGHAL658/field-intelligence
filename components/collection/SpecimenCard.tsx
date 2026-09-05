"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Lock } from "lucide-react";
import { Plant } from "@/types/plant";
import { PixelPlantIcon, PixelIconType } from "../pixel/PixelPlantIcon";

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
  customThumbnail,
}: SpecimenCardProps) {
  const specimenNumber = `#${String(index + 1).padStart(2, "0")}`;
  const pixelType = getPlantPixelType(plant);

  if (isDiscovered) {
    return (
      <Link
        href={`/species/${plant.id}`}
        className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732] hover:border-emerald-500/50 transition-all hover:bg-[#111720]"
      >
        <div className="flex items-center gap-3.5">
          {/* Thumbnail / Botanical Emblem */}
          <div className="relative h-14 w-14 rounded-xl bg-[#141B22] border border-[#1E2732] overflow-hidden flex items-center justify-center flex-shrink-0">
            {customThumbnail ? (
              <Image
                src={customThumbnail}
                alt={plant.commonName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <PixelPlantIcon type={pixelType} size={28} />
            )}
            <div className="absolute bottom-0 right-0 p-0.5 bg-[#06080A]/80 rounded-tl-md">
              <PixelPlantIcon type={pixelType} size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-zinc-500">
                Specimen {specimenNumber}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Discovered
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
              {plant.commonName}
            </h3>
            <p className="text-xs italic text-zinc-400 font-sans">{plant.scientificName}</p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors mr-1" />
      </Link>
    );
  }

  // Undiscovered / Locked State
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#090D11] border border-[#171F28] opacity-65">
      <div className="flex items-center gap-3.5">
        <div className="h-14 w-14 rounded-xl bg-[#070A0D] border border-[#171F28] flex items-center justify-center flex-shrink-0 text-zinc-600">
          <Lock className="w-5 h-5" />
        </div>

        <div>
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
    </div>
  );
}
