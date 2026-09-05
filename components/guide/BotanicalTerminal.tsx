"use client";

import React, { useState } from "react";
import { Send, LoaderCircle, Sparkles, MessageSquare } from "lucide-react";
import { plants } from "@/data/plantDatabase";
import { PixelMascot } from "../pixel/PixelMascot";

interface BotanicalTerminalProps {
  initialPlantId?: string;
}

export function BotanicalTerminal({ initialPlantId }: BotanicalTerminalProps) {
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    initialPlantId || plants[0].id
  );
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "guide"; text: string }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // initialPlantId comes from the ?plantId= query param. Navigating between
  // species while already on /guide (e.g. one "Ask AI Guide" link to
  // another) changes the prop without remounting this component, so the
  // selection has to be re-synced when it changes rather than only seeded
  // once. Adjusting state during render (vs. an effect) avoids an extra
  // render pass — see https://react.dev/learn/you-might-not-need-an-effect
  const [prevInitialPlantId, setPrevInitialPlantId] = useState(initialPlantId);
  if (initialPlantId !== prevInitialPlantId) {
    setPrevInitialPlantId(initialPlantId);
    if (initialPlantId) {
      setSelectedPlantId(initialPlantId);
    }
  }

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const suggestedPrompts = [
    `Is ${selectedPlant.commonName} toxic or safe to touch?`,
    `What are the key identification clues for this species?`,
    `What is its primary ecological role on campus?`,
    `What conservation actions are needed to protect it?`,
  ];

  const sendQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId: selectedPlantId,
          question: q,
        }),
      });

      const data = await res.json();

      if (res.ok && data.answer) {
        setMessages((prev) => [...prev, { sender: "guide", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "guide",
            text: data.error || "Unable to consult botanical guide at this time.",
          },
        ]);
      }
    } catch (err) {
      console.error("Guide fetch failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "guide",
          text: "Botanical link interrupted. Please check network connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 lg:max-w-5xl">
      {/* Specimen Selector Pill Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-zinc-500 uppercase flex-shrink-0">
          Target Specimen:
        </span>
        {plants.map((plant) => (
          <button
            key={plant.id}
            onClick={() => setSelectedPlantId(plant.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all active:scale-95 flex-shrink-0 ${
              selectedPlantId === plant.id
                ? "bg-emerald-500 text-black font-bold border border-emerald-400"
                : "bg-[#0C1015] text-zinc-400 border border-[#1E2732] hover:text-white"
            }`}
          >
            {plant.commonName}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
      {/* Terminal Container */}
      <div className="rounded-3xl bg-[#0C1015] border border-[#1E2732] p-4 sm:p-6 shadow-2xl flex flex-col h-[520px] lg:col-span-2 lg:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2732] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#141B22] border border-emerald-500/40 flex items-center justify-center">
              <PixelMascot size={32} expression="happy" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Sprout-OS Botanical Field Guide
              </h3>
              <p className="text-[10px] font-mono text-emerald-400">
                CONTEXT ANCHOR: {selectedPlant.scientificName.toUpperCase()}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-[#090D11] border border-[#1E2732] px-2 py-0.5 rounded-full">
            AI MODEL V3.5
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
              <MessageSquare className="w-8 h-8 text-emerald-500/40" />
              <div className="space-y-1 max-w-sm">
                <p className="font-semibold text-zinc-300">
                  Botanical Research Console Ready
                </p>
                <p className="text-zinc-500 text-[11px]">
                  Ask questions grounded in verified field data for{" "}
                  <span className="text-emerald-400">{selectedPlant.commonName}</span>.
                </p>
              </div>

              {/* Prompt Suggestions */}
              <div className="flex flex-col gap-1.5 w-full pt-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendQuery(prompt)}
                    className="text-left p-2.5 rounded-xl bg-[#141B22] hover:bg-[#1A232D] text-zinc-300 border border-[#1E2732] hover:border-emerald-500/40 transition-all active:scale-[0.98] text-[11px]"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1.5" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed animate-message-in ${
                  msg.sender === "user"
                    ? "ml-auto bg-emerald-500 text-black font-medium"
                    : "bg-[#141B22] border border-[#1E2732] text-zinc-200"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono p-2 animate-message-in">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              <span>CONSULTING BOTANICAL REPOSITORY...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery(input);
          }}
          className="flex items-center gap-2 pt-3 border-t border-[#1E2732] mt-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${selectedPlant.commonName}...`}
            className="flex-1 bg-[#090D11] border border-[#1E2732] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send Query"
            className="h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black flex items-center justify-center transition-all active:scale-90 disabled:active:scale-100 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Specimen Quick Reference — desktop-only supporting panel, pulled
          straight from the same verified plant record as the terminal's
          context anchor (no separate/invented data). */}
      <div className="hidden lg:block lg:col-span-1 rounded-3xl bg-[#0C1015] border border-[#1E2732] p-5 space-y-4 h-[600px] overflow-y-auto">
        <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Specimen Quick Reference
        </h4>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">{selectedPlant.commonName}</h3>
          <p className="text-xs italic text-zinc-400">{selectedPlant.scientificName}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#1E2732]">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">Family</span>
            <p className="text-xs font-medium text-zinc-200 mt-0.5 truncate">
              {selectedPlant.family}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#1E2732]">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">
              Conservation
            </span>
            <p className="text-xs font-medium text-emerald-400 mt-0.5 truncate">
              {selectedPlant.conservationStatus}
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#090D11] border border-[#1E2732]">
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">
            Native Region
          </span>
          <p className="text-xs font-medium text-zinc-200 mt-0.5">
            {selectedPlant.nativeRegion}
          </p>
        </div>

        {selectedPlant.identificationClues.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block">
              Identification Clues
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {selectedPlant.identificationClues.map((clue, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold font-mono">▸</span>
                  <span className="leading-relaxed">{clue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
