"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Home,
  Scan,
  Library,
  BookOpen,
  User,
  Camera,
  Compass,
  Trophy,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import { PixelForestBackground } from "@/components/PixelForestBackground";
import { useExplorerStore } from "@/lib/useExplorerStore";

export default function HomeDashboardPage() {
  const { totalXp, level, observations } = useExplorerStore();
  const totalSpecies = 7;
  const discoveredCount = Math.min(observations.length, totalSpecies);
  const progressPercent = ((discoveredCount / totalSpecies) * 100).toFixed(1);

  return (
    <div className="relative min-h-screen bg-black text-emerald-100 font-mono flex overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* 1. Background image layer set to plants2.png */}
      <PixelForestBackground bgImage="/plants2.png" />

      {/* 2. Left Sidebar Navigation */}
      <aside className="relative z-10 w-64 border-r border-emerald-500/20 bg-black/80 backdrop-blur-md flex flex-col justify-between shrink-0 min-h-screen p-4">
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="p-2 bg-emerald-950/80 border border-emerald-400/50 rounded-xl">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-widest leading-none">
                FIELD
              </h1>
              <h2 className="text-sm font-black text-white tracking-widest leading-tight">
                INTELLIGENCE
              </h2>
              <p className="text-[9px] text-emerald-400/70 tracking-wider">FIELD STATION</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/home"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>HOME</span>
            </Link>

            <Link
              href="/scanner"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Scan className="w-4 h-4" />
              <span>SCAN</span>
            </Link>

            <Link
              href="/collection"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Library className="w-4 h-4" />
              <span>COLLECTION</span>
            </Link>

            <Link
              href="/guide"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <BookOpen className="w-4 h-4" />
              <span>GUIDE</span>
            </Link>
          </nav>
        </div>

        <div className="text-[9px] text-zinc-600 px-2 tracking-widest uppercase">
          CAMPUS BOTANICAL SURVEY
        </div>
      </aside>

      {/* 3. Main Dashboard Content */}
      <main className="relative z-10 flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Top Header Status Bar */}
        <header className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
              FIELD STATION ONLINE
            </span>
          </div>

          <button className="p-2 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-zinc-300 hover:text-white backdrop-blur-sm">
            <User className="w-4 h-4" />
          </button>
        </header>

        {/* Top Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sprout Companion Hero Box */}
            <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                  SPROUT-OS // V2.4 FIELD COMPANION
                </span>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                  BIOZONE-07
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-950/80 border border-emerald-400/50 rounded-xl">
                  <span className="text-2xl">🐸</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">
                    WELCOME BACK, RESEARCHER! 🐸
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Ready for field work? {totalSpecies - discoveredCount} uncharted botanical taxa await identification in the campus flora zone.
                  </p>
                </div>
              </div>

              <Link
                href="/scanner"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-[0.99]"
              >
                <Camera className="w-4 h-4" />
                <span>[ 📷 SCAN SPECIMEN ]</span>
              </Link>
            </div>

            {/* Bio-Survey Telemetry Box */}
            <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    BIO-SURVEY TELEMETRY
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {discoveredCount} / {totalSpecies} <span className="text-[10px] text-zinc-500">{progressPercent}% INDEXED</span>
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  CAMPUS EXPEDITION PROGRESS
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: totalSpecies }).map((_, i) => {
                    const isUnlocked = i < discoveredCount;
                    return (
                      <div
                        key={i}
                        className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                          isUnlocked
                            ? "bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                            : "bg-zinc-950/80 border-zinc-800 text-zinc-600"
                        }`}
                      >
                        {isUnlocked ? "✓" : "🔒"}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
                  <Trophy className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-base font-black text-white">{discoveredCount}</div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase">DISCOVERED</div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
                  <span className="block text-zinc-500 text-xs mb-1">?</span>
                  <div className="text-base font-black text-white">{totalSpecies - discoveredCount}</div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase">UNCHARTED</div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
                  <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="text-base font-black text-amber-400">{totalXp || 100}</div>
                  <div className="text-[9px] font-bold text-zinc-500 uppercase">FIELD EXP</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Cards */}
          <div className="space-y-6">
            
            {/* Recent Specimen Discoveries Card */}
            <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    RECENT SPECIMEN DISCOVERIES
                  </h3>
                </div>
                <Link
                  href="/collection"
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase"
                >
                  [ VIEW ALL → ]
                </Link>
              </div>

              <div className="relative aspect-video rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80"
                  alt="Dinner Plate Aralia"
                  fill
                  unoptimized
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                <div className="absolute top-2 right-2 bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[8px] font-black px-2 py-0.5 rounded uppercase">
                  DISCOVERED
                </div>

                <div className="absolute bottom-2 left-3 right-3 space-y-0.5">
                  <span className="text-[8px] text-zinc-400 font-bold uppercase">Specimen #03</span>
                  <h4 className="text-xs font-black text-white uppercase">Dinner Plate Aralia</h4>
                  <p className="text-[9px] italic text-emerald-400">Polyscias scutellaria</p>
                  <p className="text-[8px] text-zinc-500">Observed 1×</p>
                </div>
              </div>
            </div>

            {/* Daily Field Objective Card */}
            <div className="bg-black/80 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Target className="w-3.5 h-3.5" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  DAILY FIELD OBJECTIVE
                </h3>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Inspect shaded campus ground and understory beds to locate and verify native flora specimens.
              </p>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[9px] font-bold">
                <span className="text-amber-400 flex items-center gap-1">
                  ⭐ REWARD: +50 FIELD EXP
                </span>
                <span className="text-zinc-500 uppercase">// UNLOCK DOSSIER ENTRY</span>
              </div>
            </div>

          </div>

        </div>

        {/* Conservation Awareness Bottom Banner */}
        <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Shield className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider">
              CONSERVATION AWARENESS
            </h3>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-white">Why the campus&apos;s native flora matters</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-4xl">
              Native species co-evolved with the pollinators, soil microbes, and wildlife around them — relationships that introduced or ornamental plants rarely replicate. Losing even a few native species from a habitat can ripple outward into the pollinators and soil health that depend on them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-white">7</div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase mt-0.5">CAMPUS SPECIES CATALOGUED</div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-amber-400">1</div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase mt-0.5">LOCALLY ENDEMIC SPECIES</div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-emerald-400">17</div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase mt-0.5">DOCUMENTED THREATS</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}