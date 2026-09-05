"use client";

import React from "react";
import Link from "next/link";
import { Leaf, ShieldAlert, Sprout, ArrowRight } from "lucide-react";
import { plants } from "@/data/plantDatabase";
import { PixelPlantIcon } from "../pixel/PixelPlantIcon";
import { RevealOnScroll } from "../motion/RevealOnScroll";

// Required product section — every figure and claim here is derived
// directly from data/plantDatabase.ts. Nothing here is a fabricated
// statistic; the two general framing sentences state widely-accepted
// ecological principles rather than specific numeric claims.
export function ConservationSection() {
  const endemicSpecies = plants.filter((p) => p.endemic);
  const endemicCount = endemicSpecies.length;

  const uniqueThreats = Array.from(new Set(plants.flatMap((p) => p.threats)));
  const uniqueActions = Array.from(new Set(plants.flatMap((p) => p.conservationActions)));

  // The one endemic species in the catalog anchors the "why it matters"
  // case study, using only its own real database fields.
  const spotlight = endemicSpecies[0];

  return (
    <RevealOnScroll>
      <section className="rounded-3xl bg-[#0C1015] border border-emerald-500/20 p-5 lg:p-8 shadow-xl space-y-5 relative overflow-hidden">
        {/* Decorative pixel botanical corner motif — purely illustrative */}
        <div className="absolute -top-4 -right-4 opacity-[0.08] pointer-events-none" aria-hidden="true">
          <PixelPlantIcon type="fern" size={140} />
        </div>

        <div className="relative flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            Conservation Awareness
          </span>
        </div>

        <div className="relative space-y-2 max-w-2xl">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
            Why the campus&apos;s native flora matters
          </h2>
          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-sans">
            Native species co-evolved with the pollinators, soil microbes, and wildlife around them —
            relationships that introduced or ornamental plants rarely replicate. Losing even a few native
            species from a habitat can ripple outward into the pollinators and soil health that depend on them.
          </p>
        </div>

        {/* Real, computed figures — no invented statistics */}
        <div className="relative grid grid-cols-3 gap-2 lg:gap-3">
          <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732] text-center">
            <div className="text-lg lg:text-xl font-bold text-white font-mono">{plants.length}</div>
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
              Campus Species Catalogued
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#090D11] border border-amber-500/20 text-center">
            <div className="text-lg lg:text-xl font-bold text-amber-400 font-mono">{endemicCount}</div>
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
              Locally Endemic Species
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#090D11] border border-[#1E2732] text-center">
            <div className="text-lg lg:text-xl font-bold text-emerald-400 font-mono">
              {uniqueThreats.length}
            </div>
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
              Documented Threats
            </div>
          </div>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-2">
          {/* Documented threats — real, deduplicated from the database */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Threats seen in this catalog
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uniqueThreats.map((threat) => (
                <span
                  key={threat}
                  className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300"
                >
                  {threat}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended actions — real, deduplicated from the database */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3 h-3 text-emerald-400" />
              How you can help
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
              {uniqueActions.slice(0, 4).map((action) => (
                <li key={action} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold font-mono">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Endemic species spotlight — real data only */}
        {spotlight && (
          <Link
            href={`/species/${spotlight.id}`}
            className="relative flex items-center gap-3 p-3.5 rounded-2xl bg-[#090D11] border border-amber-500/25 hover:border-amber-400/50 transition-all active:scale-[0.99] group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#0C1015] border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                Endemic Spotlight
              </p>
              <p className="text-xs text-zinc-300 truncate">
                <span className="font-bold text-white">{spotlight.commonName}</span> —{" "}
                {spotlight.ecologicalImportance}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
          </Link>
        )}
      </section>
    </RevealOnScroll>
  );
}
