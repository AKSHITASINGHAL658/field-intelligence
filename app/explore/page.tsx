"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Sparkles, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { plants } from "@/data/plantDatabase";

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");

  const families = Array.from(new Set(plants.map((p) => p.family)));

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.family.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFamily = selectedFamily === "all" || plant.family === selectedFamily;

    return matchesSearch && matchesFamily;
  });

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-5 space-y-5 text-left md:max-w-2xl lg:max-w-6xl lg:px-8 lg:py-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Flora Explorer</h1>
          <p className="text-xs text-zinc-400 font-sans">
            Catalogue index of all documented campus botanical taxa
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by common, scientific, or family name..."
            className="w-full bg-[#0C1015] border border-[#1E2732] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Family Filter Scroll Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFamily("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all ${
              selectedFamily === "all"
                ? "bg-emerald-500 text-black font-bold"
                : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
            }`}
          >
            All Families
          </button>
          {families.map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all active:scale-95 ${
                selectedFamily === fam
                  ? "bg-emerald-500 text-black font-bold"
                  : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="space-y-2.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant, idx) => (
              <Link
                key={plant.id}
                href={`/species/${plant.id}`}
                className="group p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 active:scale-[0.98] block space-y-2 animate-stagger-in"
                style={{ "--stagger-delay": `${Math.min(idx, 8) * 40}ms` } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">
                    TAXON #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {plant.endemic && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1 font-bold">
                        <Sparkles className="w-2.5 h-2.5" /> ENDEMIC
                      </span>
                    )}
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#141B22] border border-[#1E2732] text-zinc-400">
                      {plant.family}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {plant.commonName}
                    </h3>
                    <p className="text-xs italic text-zinc-400">{plant.scientificName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed pt-1 border-t border-[#171F28]">
                  {plant.ecologicalImportance}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 space-y-2 md:col-span-2 lg:col-span-3">
              <Filter className="w-6 h-6 mx-auto text-zinc-600" />
              <p className="text-xs">No matching species found in campus catalog.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
