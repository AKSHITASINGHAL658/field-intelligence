"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { SpecimenCard } from "@/components/collection/SpecimenCard";
import { useExplorerStore } from "@/lib/useExplorerStore";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { plants } from "@/data/plantDatabase";

type FilterTab = "all" | "discovered" | "undiscovered";

export default function DiscoveriesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const { isHydrated, discovered, discoveredCount, totalCatalogCount, isDiscovered } =
    useExplorerStore();

  const undiscoveredCount = totalCatalogCount - discoveredCount;
  const progressPercent = totalCatalogCount > 0 ? (discoveredCount / totalCatalogCount) * 100 : 0;

  const filteredPlants = plants.filter((plant) => {
    const discoveredFlag = isDiscovered(plant.id);
    if (activeFilter === "discovered") return discoveredFlag;
    if (activeFilter === "undiscovered") return !discoveredFlag;
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-5 space-y-5 text-left md:max-w-2xl lg:max-w-6xl lg:px-8 lg:py-8">
        {/* Header Hero Card */}
        <RevealOnScroll>
        <section className="rounded-3xl bg-[#0C1015] border border-[#1E2732] p-5 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">Field Collection</h1>
              <p className="text-xs text-zinc-400 font-sans">
                Campus flora & botanical taxon compendium
              </p>
            </div>
            <div className="p-1 rounded-xl bg-[#141B22] border border-emerald-500/30">
              <PixelMascot size={36} expression={discoveredCount > 0 ? "happy" : "curious"} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-emerald-400 font-bold">
              {isHydrated ? String(discoveredCount).padStart(2, "0") : "00"} /{" "}
              {String(totalCatalogCount).padStart(2, "0")} Discovered
            </span>
            <span className="text-[10px] bg-[#141B22] text-zinc-400 border border-[#1E2732] px-2.5 py-0.5 rounded-full font-bold">
              {isHydrated ? undiscoveredCount : totalCatalogCount} Undiscovered
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#080D11] border border-[#171F28] overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full shadow-[0_0_8px_#10B981]"
              style={{ width: `${isHydrated ? progressPercent : 0}%` }}
            />
          </div>
        </section>
        </RevealOnScroll>

        {/* Filter Tab Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
              activeFilter === "all"
                ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
            }`}
          >
            All ({totalCatalogCount})
          </button>

          <button
            onClick={() => setActiveFilter("discovered")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
              activeFilter === "discovered"
                ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
            }`}
          >
            Discovered ({isHydrated ? discoveredCount : 0})
          </button>

          <button
            onClick={() => setActiveFilter("undiscovered")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
              activeFilter === "undiscovered"
                ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
            }`}
          >
            Undiscovered ({isHydrated ? undiscoveredCount : totalCatalogCount})
          </button>
        </div>

        {/* Specimen Card Grid */}
        <div className="space-y-2.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlants.map((plant, position) => {
            const index = plants.findIndex((p) => p.id === plant.id);
            const discoveredFlag = isDiscovered(plant.id);
            const record = discovered[plant.id];

            return (
              <div
                key={plant.id}
                className="animate-stagger-in"
                style={{ "--stagger-delay": `${Math.min(position, 8) * 40}ms` } as React.CSSProperties}
              >
                <SpecimenCard
                  plant={plant}
                  index={index}
                  isDiscovered={discoveredFlag}
                  observationCount={record?.observationCount}
                  customThumbnail={record?.thumbnailUrl}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
