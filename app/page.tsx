"use client";

import React from "react";
import Link from "next/link";
import { Camera, Check, Lock, Star, HelpCircle, ArrowRight, ClipboardList, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { SpecimenCard } from "@/components/collection/SpecimenCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { useExplorerStore } from "@/lib/useExplorerStore";
import { plants } from "@/data/plantDatabase";

export default function HomePage() {
  const { isHydrated, discovered, discoveredCount, totalCatalogCount, exp, isDiscovered } =
    useExplorerStore();

  const unchartedCount = totalCatalogCount - discoveredCount;
  const progressPercent = totalCatalogCount > 0 ? (discoveredCount / totalCatalogCount) * 100 : 0;

  // Recent discoveries list — most recently observed first
  const discoveredPlants = plants
    .filter((p) => isDiscovered(p.id))
    .sort((a, b) => {
      const aTime = discovered[a.id]?.lastObservedAt ?? "";
      const bTime = discovered[b.id]?.lastObservedAt ?? "";
      return bTime.localeCompare(aTime);
    });

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-5 space-y-5 md:max-w-2xl lg:max-w-6xl lg:px-8 lg:py-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 lg:items-start">
      <div className="lg:col-span-2 space-y-5 lg:space-y-6">
        {/* 1. Sprout-OS Field Companion Card */}
        <section className="rounded-3xl bg-[#0C1015] border border-[#1E2732] p-5 lg:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-400" />
              SPROUT-OS // V2.4 FIELD COMPANION
            </span>
            <span className="text-[10px] font-bold bg-[#141B22] text-zinc-400 px-2 py-0.5 rounded-full border border-[#1E2732]">
              BIOZONE-07
            </span>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#080D11] border border-[#171F28]">
            <div className="p-1 rounded-xl bg-[#0C1015] border border-emerald-500/30 flex-shrink-0">
              <PixelMascot size={48} expression={discoveredCount > 0 ? "happy" : "curious"} />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-white flex items-center gap-1">
                WELCOME BACK, RESEARCHER! 🐸
              </p>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                {isHydrated && discoveredCount === 0
                  ? "Field station initialized. 7 uncharted botanical taxa await your first scan."
                  : `Ready for field work? ${unchartedCount} uncharted botanical taxa await identification in the campus flora zone.`}
              </p>
            </div>
          </div>

          <Link
            href="/scanner"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            <Camera className="w-4 h-4" /> [ 📷 SCAN SPECIMEN ]
          </Link>
        </section>

        {/* 2. Expedition Progress & Telemetry */}
        <section className="rounded-3xl bg-[#0C1015] border border-[#1E2732] p-5 shadow-xl space-y-4 text-left">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase tracking-wider font-bold">
              BIO-SURVEY TELEMETRY
            </span>
            <span className="text-emerald-400 font-bold">
              {isHydrated ? `${discoveredCount} / ${totalCatalogCount}` : "0 / 7"}{" "}
              <span className="text-zinc-500 font-normal">
                {isHydrated ? `${progressPercent.toFixed(1)}% INDEXED` : "0% INDEXED"}
              </span>
            </span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            CAMPUS EXPEDITION PROGRESS
          </h3>

          {/* 7 Specimen Checkmark / Lock Blocks */}
          <div className="grid grid-cols-7 gap-1.5">
            {plants.map((plant, index) => {
              const unlocked = isDiscovered(plant.id);
              return (
                <div
                  key={plant.id}
                  className={`h-9 rounded-xl flex items-center justify-center text-xs font-mono transition-all ${
                    unlocked
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                      : "bg-[#090D11] text-zinc-600 border border-[#171F28]"
                  }`}
                  title={unlocked ? plant.commonName : `Specimen #${index + 1} (Uncharted)`}
                >
                  {unlocked ? <Check className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              );
            })}
          </div>

          {/* 3 Metric Stat Boxes */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732]">
              <Layers className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-base font-bold text-white font-mono">
                {isHydrated ? discoveredCount : 0}
              </div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                DISCOVERED
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732]">
              <HelpCircle className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
              <div className="text-base font-bold text-white font-mono">
                {isHydrated ? unchartedCount : totalCatalogCount}
              </div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                UNCHARTED
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732]">
              <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-base font-bold text-amber-400 font-mono">
                {isHydrated ? exp : 0}
              </div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                FIELD EXP
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-5 lg:space-y-6 lg:col-span-1">
        {/* 3. Recent Specimen Discoveries */}
        <RevealOnScroll>
        <section className="space-y-3 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-400" />
              RECENT SPECIMEN DISCOVERIES
            </h3>
            <Link
              href="/discoveries"
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              [ VIEW ALL <ArrowRight className="w-3 h-3" /> ]
            </Link>
          </div>

          {discoveredPlants.length > 0 ? (
            <div className="space-y-2.5">
              {discoveredPlants.slice(0, 3).map((plant, position) => {
                const record = discovered[plant.id];
                const index = plants.findIndex((p) => p.id === plant.id);
                return (
                  <div
                    key={plant.id}
                    className="animate-stagger-in"
                    style={{ "--stagger-delay": `${position * 60}ms` } as React.CSSProperties}
                  >
                    <SpecimenCard
                      plant={plant}
                      index={index}
                      isDiscovered={true}
                      observationCount={record?.observationCount}
                      customThumbnail={record?.thumbnailUrl}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#0C1015] border border-[#1E2732] text-center space-y-2">
              <p className="text-xs font-semibold text-zinc-400">
                No specimens catalogued yet
              </p>
              <p className="text-[11px] text-zinc-600 max-w-xs mx-auto">
                Scan your first campus plant to unlock its scientific profile in your personal field collection.
              </p>
            </div>
          )}
        </section>
        </RevealOnScroll>

        {/* 4. Daily Field Objective */}
        <RevealOnScroll delayMs={100}>
        <section className="rounded-3xl bg-[#0C1015] border border-amber-500/30 p-5 shadow-xl text-left space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ClipboardList className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              DAILY FIELD OBJECTIVE
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Inspect shaded campus ground and understory beds to locate and verify native flora specimens.
          </p>

          <div className="pt-2 border-t border-[#1E2732] flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3 h-3" /> REWARD: +50 FIELD EXP
            </span>
            <span className="text-zinc-500">{"// UNLOCK DOSSIER ENTRY"}</span>
          </div>
        </section>
        </RevealOnScroll>
      </div>
      </div>
    </AppShell>
  );
}