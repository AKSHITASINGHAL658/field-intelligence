"use client";

import Link from "next/link";
import { useExplorerStore } from "@/lib/useExplorerStore";
import {
  Camera,
  Trophy,
  Sparkles,
  Compass,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const { xp, level, progressPercent, scansCount, badges } = useExplorerStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Compass className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-emerald-400 bg-clip-text text-transparent">
                FLORA SPATIAL
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                Field Intelligence OS
              </p>
            </div>
          </div>

          {/* Gamified Rank & Level Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Level {level} Explorer</span>
                <span className="text-zinc-500">•</span>
                <span className="text-emerald-400 font-mono">{xp} XP</span>
              </div>
              <div className="w-36 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1 border border-zinc-700/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <Link
              href="/scanner"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" /> Launch AR Scanner
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Hub */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Botanical AR Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Explore Nature like an <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Augmented Reality</span> Field Agent.
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Identify native species, measure ecological impact, and collect high-value explorer badges using live spatial scanning and contextual botanical RAG models.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/scanner"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                Start Field Scan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats & Progression Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-mono">Total Scans</p>
              <h3 className="text-xl font-bold text-white">{scansCount} Specimens</h3>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-mono">Explorer Level</p>
              <h3 className="text-xl font-bold text-white">Level {level}</h3>
            </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase font-mono">Badges Earned</p>
              <h3 className="text-xl font-bold text-white">
                {badges.filter((b) => b.unlocked).length} / {badges.length}
              </h3>
            </div>
          </div>
        </section>

        {/* Gamified Achievements Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Field Achievements</h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Complete tasks to gain XP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  badge.unlocked
                    ? "bg-zinc-900/90 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-zinc-950/50 border-zinc-800/60 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      badge.unlocked
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}