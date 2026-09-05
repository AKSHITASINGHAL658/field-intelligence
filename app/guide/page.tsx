"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BotanicalTerminal } from "@/components/guide/BotanicalTerminal";

function GuideContent() {
  const searchParams = useSearchParams();
  const plantId = searchParams.get("plantId") || undefined;

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-4 md:max-w-2xl lg:max-w-6xl lg:px-8 lg:py-8">
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white">Botanical Guide</h1>
        <p className="text-xs text-zinc-400 font-sans">
          Context-grounded botanical intelligence powered by Gemini 3.5
        </p>
      </div>

      <BotanicalTerminal initialPlantId={plantId} />
    </div>
  );
}

export default function GuidePage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            LOADING RESEARCH TERMINAL...
          </div>
        }
      >
        <GuideContent />
      </Suspense>
    </AppShell>
  );
}
