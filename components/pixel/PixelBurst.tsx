"use client";

import React from "react";

// Fixed, deterministic angles — no Math.random(), so nothing here depends
// on when/where it renders. This only ever mounts client-side in response
// to a real interaction (hover, a genuine new discovery), never during SSR.
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

interface PixelBurstProps {
  /** Change this value to replay the burst (keys the whole particle set) */
  triggerKey: string | number;
  colorClassName?: string;
}

export function PixelBurst({ triggerKey, colorClassName = "bg-emerald-400" }: PixelBurstProps) {
  return (
    <div
      key={triggerKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {ANGLES.map((angle, i) => (
        <span
          key={angle}
          className={`absolute left-1/2 top-1/2 h-1 w-1 ${colorClassName} animate-pixel-burst`}
          style={{ "--burst-angle": `${angle}deg`, animationDelay: `${i * 12}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
