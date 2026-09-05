"use client";

import React from "react";

interface PixelFrameProps {
  /** Lit "engaged" corners vs a dim idle tone */
  active?: boolean;
  /** Corner color when active — always a real, existing palette color */
  tone?: "emerald" | "amber";
  /** Adds the same gentle pulse used by the scanner reticle */
  pulsing?: boolean;
  /** Corner bracket size in px */
  size?: number;
  className?: string;
}

// Four corner brackets, reusable wherever a "collectible card" or
// "targeting frame" treatment is wanted — extracted from PixelReticle's
// original bracket styling so both share one implementation.
export function PixelFrame({
  active = true,
  tone = "emerald",
  pulsing = false,
  size = 14,
  className = "",
}: PixelFrameProps) {
  const activeColor = tone === "amber" ? "border-amber-400" : "border-emerald-400";
  const color = active ? activeColor : "border-zinc-700";
  const pulse = pulsing ? "animate-pulse-gentle" : "";
  const dim = `${color} ${pulse}`;
  const s = `${size}px`;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className={`absolute left-0 top-0 border-l-2 border-t-2 ${dim}`} style={{ width: s, height: s }} />
      <div className={`absolute right-0 top-0 border-r-2 border-t-2 ${dim}`} style={{ width: s, height: s }} />
      <div className={`absolute bottom-0 left-0 border-b-2 border-l-2 ${dim}`} style={{ width: s, height: s }} />
      <div className={`absolute bottom-0 right-0 border-b-2 border-r-2 ${dim}`} style={{ width: s, height: s }} />
    </div>
  );
}
