import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MessageSquare, Scale, ShieldAlert, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DossierPlate } from "@/components/dossier/DossierPlate";
import { HazardCard } from "@/components/dossier/HazardCard";
import { getPlantById, plants } from "@/data/plantDatabase";

interface SpeciesPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeciesPage({ params }: SpeciesPageProps) {
  const { id } = await params;
  const plant = getPlantById(id);

  if (!plant) {
    notFound();
  }

  const catalogIndex = plants.findIndex((p) => p.id === plant.id);
  const specimenNumber = `#${String(catalogIndex !== -1 ? catalogIndex + 1 : 1).padStart(2, "0")}`;

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-4 space-y-4 text-left md:max-w-2xl lg:max-w-6xl lg:px-8 lg:py-8">
        {/* Top Dossier Header */}
        <div className="flex items-center justify-between text-xs font-mono">
          <Link
            href="/discoveries"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>SPECIMEN DOSSIER</span>
          </Link>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0C1015] border border-[#1E2732] text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            VERIFIED TAXON
          </span>
        </div>

        {/* Specimen Number Banner */}
        <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#1E2732] pb-2">
          <span className="text-zinc-500 uppercase">CATALOGUE ID: {specimenNumber}</span>
          <span className="text-emerald-400 font-bold uppercase">{plant.family}</span>
        </div>

        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-8 lg:items-start">
        <div className="space-y-4 lg:col-span-2 lg:sticky lg:top-24">
        {/* Hero Visual Plate */}
        <DossierPlate plant={plant} />

        {/* Taxonomy Title Section */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#141B22] border border-[#1E2732] text-zinc-300">
              FAM. {plant.family.toUpperCase()}
            </span>
            {plant.endemic && (
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NATIVE ENDEMIC
              </span>
            )}
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              IUCN: {plant.conservationStatus}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">{plant.commonName}</h1>
          <p className="text-sm italic text-zinc-400 font-sans">{plant.scientificName}</p>
        </div>

        {/* Toxicity Hazard Card (Appears only for toxic plants like Cleistanthus collinus) */}
        <HazardCard plant={plant} />

        {/* Identification Clues */}
        {plant.identificationClues.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                IDENTIFICATION CLUES
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-sans">
              {plant.identificationClues.map((clue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold font-mono">▸</span>
                  <span className="leading-relaxed">{clue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>

        <div className="space-y-4 lg:col-span-3">
        {/* Habitat & Native Distribution */}
        <div className="p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
            HABITAT & BIOGEOGRAPHY
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#171F28]">
              <span className="text-[10px] font-mono text-zinc-500 block">MICRO-HABITAT</span>
              <p className="font-medium text-zinc-200 mt-0.5">{plant.habitat}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#171F28]">
              <span className="text-[10px] font-mono text-zinc-500 block">NATIVE REGION</span>
              <p className="font-medium text-zinc-200 mt-0.5">{plant.nativeRegion}</p>
            </div>
          </div>
        </div>

        {/* Ecological Role */}
        <div className="p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-2">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
            ECOLOGICAL IMPORTANCE
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {plant.ecologicalImportance}
          </p>
        </div>

        {/* Threats & Conservation Actions */}
        <div className="p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              CONSERVATION & THREAT PROFILE
            </span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1">
                DOCUMENTED THREATS
              </span>
              <ul className="space-y-1 text-zinc-300">
                {plant.threats.map((threat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[#1E2732]">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                RECOMMENDED ACTIONS
              </span>
              <ul className="space-y-1 text-zinc-300">
                {plant.conservationActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href={`/guide?plantId=${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <MessageSquare className="w-4 h-4" />
            Ask Field Guide About Specimen
          </Link>

          <Link
            href={`/compare?primary=${plant.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141B22] hover:bg-[#1A232D] text-zinc-200 border border-[#1E2732] font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            Compare With Another Species
          </Link>
        </div>
        </div>
        </div>
      </div>
    </AppShell>
  );
}
