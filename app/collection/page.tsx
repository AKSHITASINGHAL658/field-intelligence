"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Sparkles,
  Trophy,
  Search,
  X,
  Globe,
  Leaf,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Zap
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PixelForestBackground } from "@/components/PixelForestBackground";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { plants } from "@/data/plantDatabase";
import { useExplorerStore } from "@/lib/useExplorerStore";
import { Plant } from "@/types/plant";

const MASTER_CATALOG: Array<Plant & { imageUrl: string }> = plants.map((plant) => ({
  ...plant,
  imageUrl: plant.image || "/plants/plant-01.jpg",
}));

type FilterTab = "all" | "discovered" | "locked";

export default function CollectionPage() {
  const { observations, totalXp, level } = useExplorerStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Map user observations to plant IDs
  const discoveredMap = useMemo(() => {
    const map = new Map<string, { count: number; date: string }>();
    observations.forEach((obs) => {
      const existing = map.get(obs.plantId);
      if (existing) {
        map.set(obs.plantId, { ...existing, count: existing.count + 1 });
      } else {
        map.set(obs.plantId, { count: 1, date: obs.timestamp });
      }
    });
    return map;
  }, [observations]);

  // Catalog items enriched with discovery state
  const pokedexEntries = useMemo(() => {
    return MASTER_CATALOG.map((plant, idx) => {
      const entry = discoveredMap.get(plant.id);
      return {
        ...plant,
        pokedexNumber: `#${String(idx + 1).padStart(3, "0")}`,
        isDiscovered: Boolean(entry),
        scanCount: entry?.count ?? 0,
        discoveredAt: entry?.date ?? null,
      };
    });
  }, [discoveredMap]);

  // Filtered Pokédex list
  const filteredEntries = useMemo(() => {
    return pokedexEntries.filter((entry) => {
      const matchesSearch =
        entry.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.pokedexNumber.includes(searchQuery);

      if (!matchesSearch) return false;
      if (activeTab === "discovered") return entry.isDiscovered;
      if (activeTab === "locked") return !entry.isDiscovered;
      return true;
    });
  }, [pokedexEntries, searchQuery, activeTab]);

  const totalCatalog = pokedexEntries.length;
  const discoveredCount = pokedexEntries.filter((e) => e.isDiscovered).length;
  const completionPercentage = Math.round((discoveredCount / totalCatalog) * 100) || 0;

  return (
    <AppShell>
      {/* 8-Bit Pixel Parallax Forest Background */}
      <PixelForestBackground />

      <div className="relative z-10 max-w-md mx-auto px-4 py-4 space-y-4 font-mono md:max-w-xl lg:max-w-5xl lg:px-8 lg:py-8">
        
        {/* POKÉDEX TOP HUD HEADER */}
        <div className="bg-black/90 border-4 border-emerald-500 p-3.5 shadow-[6px_6px_0px_#000] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-200 transition-colors font-black uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>◄ MAIN HUB</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black font-black px-2 py-0.5 border-2 border-black text-[10px] shadow-[2px_2px_0px_#000]">
                LVL {level}
              </span>
              <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 border border-emerald-500 text-[10px]">
                {totalXp} XP
              </span>
            </div>
          </div>

          {/* Title & Mascot Row */}
          <div className="flex items-center justify-between pt-1 border-t-2 border-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-red-600 border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-emerald-300 uppercase tracking-widest leading-none">
                  FLORA POKÉDEX
                </h1>
                <p className="text-[10px] text-zinc-400 mt-1">
                  BOTANICAL INDEX: {discoveredCount} / {totalCatalog} SPECIES REGISTERED
                </p>
              </div>
            </div>

            <div className="hidden sm:block">
              <PixelMascot size={36} expression="happy" />
            </div>
          </div>

          {/* Retro Arcade Completion Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-bold text-emerald-400 uppercase">
              <span>CATALOG COMPLETION</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-4 w-full bg-black border-2 border-emerald-500 p-0.5 flex">
              <div
                className="h-full bg-emerald-400 transition-all duration-500 relative"
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:4px_100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Retro Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY SPECIES OR #..."
              className="w-full bg-black/90 border-4 border-emerald-500 pl-9 pr-3 py-2 text-xs font-bold text-emerald-300 placeholder:text-emerald-800 uppercase focus:outline-none shadow-[4px_4px_0px_#000]"
            />
          </div>

          {/* Arcade Filter Tabs */}
          <div className="flex bg-black/90 border-4 border-emerald-500 p-1 shadow-[4px_4px_0px_#000] gap-1">
            {(["all", "discovered", "locked"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-3 py-1 text-[10px] font-black uppercase transition-all ${
                  activeTab === tab
                    ? "bg-emerald-500 text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                    : "text-emerald-500 hover:bg-emerald-950"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* POKÉDEX GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => entry.isDiscovered && setSelectedPlant(entry)}
              className={`relative bg-black/85 border-4 transition-all duration-150 p-2.5 shadow-[4px_4px_0px_#000] flex flex-col justify-between group ${
                entry.isDiscovered
                  ? "border-emerald-500 cursor-pointer hover:-translate-y-1 hover:border-yellow-400 hover:shadow-[6px_6px_0px_#000]"
                  : "border-zinc-800 opacity-70 cursor-not-allowed"
              }`}
            >
              {/* Card Header: Pokédex # & Type Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-yellow-400 bg-black border border-yellow-400 px-1.5 py-0.5">
                  {entry.pokedexNumber}
                </span>

                {entry.isDiscovered ? (
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950 border border-emerald-500 px-1 py-0.5 uppercase">
                    {entry.family.slice(0, 7)}
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                )}
              </div>

              {/* Plant Pixel Sprite Frame */}
              <div className="relative aspect-square w-full bg-[#08100a] border-2 border-emerald-900 overflow-hidden flex items-center justify-center mb-2">
                {entry.isDiscovered ? (
                  <>
                    <Image
                      src={entry.imageUrl ?? entry.image}
                      alt={entry.commonName}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Retro Pixel Overlay Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none" />
                  </>
                ) : (
                  /* Locked Pokédex Silhouette */
                  <div className="flex flex-col items-center justify-center text-center p-2 space-y-1">
                    <div className="relative w-12 h-12 grayscale brightness-0 contrast-200 opacity-30">
                      <Image
                        src={entry.imageUrl ?? entry.image}
                        alt="Unknown Specimen"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      ? ? ?
                    </span>
                  </div>
                )}
              </div>

              {/* Card Bottom Text */}
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase text-emerald-300 truncate">
                  {entry.isDiscovered ? entry.commonName : "UNDISCOVERED"}
                </h3>
                <p className="text-[9px] italic text-zinc-400 truncate">
                  {entry.isDiscovered ? entry.scientificName : "UNKNOWN SPECIES"}
                </p>
              </div>

              {/* Discovered Counter Badge */}
              {entry.isDiscovered && (
                <div className="mt-2 pt-1.5 border-t border-dashed border-emerald-900 flex justify-between items-center text-[9px] text-yellow-300 font-bold">
                  <span>SCANNED</span>
                  <span className="bg-yellow-400 text-black px-1 border border-black">
                    {entry.scanCount}x
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredEntries.length === 0 && (
          <div className="bg-black/90 border-4 border-emerald-500 p-8 text-center space-y-3 shadow-[6px_6px_0px_#000]">
            <PixelMascot size={48} expression="confused" />
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              NO MATCHING POKÉDEX SPECIES FOUND!
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-4 py-2 bg-emerald-500 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        {/* DETAILED POKÉDEX SCREEN MODAL */}
        {selectedPlant && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-black border-4 border-emerald-500 p-4 font-mono shadow-[10px_10px_0px_#000] space-y-4 animate-stage-in">
              
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between border-b-4 border-emerald-500 pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 border border-black">
                    #{selectedPlant.id.slice(0, 3).toUpperCase()}
                  </span>
                  <h2 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                    POKÉDEX DATA SCREEN
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="bg-red-600 hover:bg-red-500 text-white border-2 border-black p-1 shadow-[2px_2px_0px_#000]"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Plant Image & Main Stats Layout */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="relative aspect-square border-4 border-emerald-800 bg-[#08100a] overflow-hidden">
                  <Image
                    src={selectedPlant.imageUrl ?? selectedPlant.image}
                    alt={selectedPlant.commonName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none" />
                </div>

                {/* Pixel Stat Meters */}
                <div className="space-y-2 text-xs">
                  <div>
                    <h3 className="text-sm font-black text-yellow-300 uppercase">
                      {selectedPlant.commonName}
                    </h3>
                    <p className="text-[10px] italic text-zinc-400">
                      {selectedPlant.scientificName}
                    </p>
                  </div>

                  <div className="bg-[#0a140c] border-2 border-emerald-900 p-2 space-y-1.5 text-[10px]">
                    <div>
                      <span className="text-emerald-500 font-bold uppercase">FAMILY:</span>
                      <p className="text-white font-bold">{selectedPlant.family}</p>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-bold uppercase">ORIGIN:</span>
                      <p className="text-white font-bold">{selectedPlant.nativeRegion}</p>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-bold uppercase">STATUS:</span>
                      <p className="text-yellow-400 font-bold">{selectedPlant.conservationStatus}</p>
                    </div>
                  </div>

                  {/* Pixelated Attribute Bar */}
                  <div className="space-y-1 text-[9px] font-bold">
                    <div className="flex justify-between text-emerald-400">
                      <span>RARITY LEVEL:</span>
                      <span>{selectedPlant.endemic ? "RARE / ENDEMIC" : "COMMON"}</span>
                    </div>
                    <div className="h-2 bg-black border border-emerald-500 p-0.5 flex gap-0.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 ${
                            i < (selectedPlant.endemic ? 7 : 3)
                              ? "bg-yellow-400"
                              : "bg-emerald-950"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ecological Lore Text Block */}
              <div className="bg-[#0a140c] border-2 border-emerald-900 p-2.5 text-[10px] space-y-1">
                <span className="text-yellow-400 font-black uppercase flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> ECOLOGICAL ROLE
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedPlant.ecologicalImportance}
                </p>
              </div>

              {/* Mascot Reaction Footer */}
              <div className="flex items-center justify-between bg-emerald-950 border-2 border-emerald-500 p-2">
                <div className="flex items-center gap-2">
                  <PixelMascot size={28} expression="happy" />
                  <span className="text-[10px] font-bold text-emerald-300">
                    "SPECIMEN RECORDED IN FLORA DEX!"
                  </span>
                </div>

                <Link
                  href={`/species/${selectedPlant.id}`}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1"
                >
                  <span>FULL DOSSIER</span>
                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}