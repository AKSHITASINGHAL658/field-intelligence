"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Scale, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { plants } from "@/data/plantDatabase";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialPrimary = searchParams.get("primary") || plants[0].id;
  const initialSecondary = searchParams.get("secondary") || plants[1].id;

  const [plantAId, setPlantAId] = useState(initialPrimary);
  const [plantBId, setPlantBId] = useState(
    initialSecondary === initialPrimary ? plants[1].id : initialSecondary
  );

  const plantA = plants.find((p) => p.id === plantAId) || plants[0];
  const plantB = plants.find((p) => p.id === plantBId) || plants[1];

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-5 text-left md:max-w-2xl lg:max-w-5xl lg:px-8 lg:py-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-emerald-400" />
          Taxonomic Compare
        </h1>
        <p className="text-xs text-zinc-400 font-sans">
          Side-by-side comparative morphological analysis of campus flora
        </p>
      </div>

      {/* Dual Selector */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0C1015] border border-[#1E2732]">
        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
            Specimen A
          </label>
          <select
            value={plantAId}
            onChange={(e) => setPlantAId(e.target.value)}
            className="w-full bg-[#080D11] border border-[#1E2732] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === plantBId}>
                {p.commonName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
            Specimen B
          </label>
          <select
            value={plantBId}
            onChange={(e) => setPlantBId(e.target.value)}
            className="w-full bg-[#080D11] border border-[#1E2732] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === plantAId}>
                {p.commonName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Matrix Cards */}
      <div className="space-y-3">
        {/* Specimen Names Header */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732]">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
              SPECIMEN A
            </span>
            <h3 className="text-sm font-bold text-white mt-1">{plantA.commonName}</h3>
            <p className="text-xs italic text-zinc-400">{plantA.scientificName}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732]">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              SPECIMEN B
            </span>
            <h3 className="text-sm font-bold text-white mt-1">{plantB.commonName}</h3>
            <p className="text-xs italic text-zinc-400">{plantB.scientificName}</p>
          </div>
        </div>

        {/* Family */}
        <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
            FAMILY CLADE
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <span className="font-mono text-zinc-200">{plantA.family}</span>
            <span className="font-mono text-zinc-200">{plantB.family}</span>
          </div>
        </div>

        {/* Endemic & Origin */}
        <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
            BIOGEOGRAPHY & ENDEMISM
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-zinc-300">{plantA.nativeRegion}</p>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                {plantA.endemic ? "NATIVE ENDEMIC" : "INTRODUCED"}
              </span>
            </div>
            <div>
              <p className="text-zinc-300">{plantB.nativeRegion}</p>
              <span className="text-[10px] font-mono font-bold text-cyan-400">
                {plantB.endemic ? "NATIVE ENDEMIC" : "INTRODUCED"}
              </span>
            </div>
          </div>
        </div>

        {/* Conservation Status */}
        <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
            CONSERVATION STATUS
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <span className="font-medium text-emerald-400">{plantA.conservationStatus}</span>
            <span className="font-medium text-cyan-400">{plantB.conservationStatus}</span>
          </div>
        </div>

        {/* Toxicity Check */}
        {(plantA.id === "plant-07" || plantB.id === "plant-07") && (
          <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              TOXICITY WARNING CONTRAST
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
              <span className={plantA.id === "plant-07" ? "text-amber-400 font-bold" : "text-zinc-500"}>
                {plantA.id === "plant-07" ? "HIGH TOXICITY WARNING" : "Non-toxic observed"}
              </span>
              <span className={plantB.id === "plant-07" ? "text-amber-400 font-bold" : "text-zinc-500"}>
                {plantB.id === "plant-07" ? "HIGH TOXICITY WARNING" : "Non-toxic observed"}
              </span>
            </div>
          </div>
        )}

        {/* Ecological Role */}
        <div className="p-3.5 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
            ECOLOGICAL ROLE
          </span>
          <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
            <p className="text-zinc-300">{plantA.ecologicalImportance}</p>
            <p className="text-zinc-300">{plantB.ecologicalImportance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-zinc-500">LOADING COMPARISON MATRIX...</div>}>
        <CompareContent />
      </Suspense>
    </AppShell>
  );
}
