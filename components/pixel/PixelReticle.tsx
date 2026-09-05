"use client";

import React from "react";
import { PixelFrame } from "./PixelFrame";

interface PixelReticleProps {
  scanning?: boolean;
}

export function PixelReticle({ scanning = false }: PixelReticleProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* 4 Optical Corner Brackets */}
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        <PixelFrame size={32} pulsing={scanning} />

        {/* Center Crosshair [+] */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-6 w-6 border border-emerald-400/60 flex items-center justify-center">
            <span className="text-emerald-400 text-xs font-mono font-bold leading-none">+</span>
          </div>
        </div>

        {/* Laser scanline + traveling edge fragments when actively processing */}
        {scanning && (
          <>
            <div className="absolute inset-x-2 top-0 h-0.5 animate-scan-laser bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.9)]" />
            <span
              className="absolute top-0 h-[3px] w-[3px] bg-emerald-300 shadow-[0_0_4px_1px_rgba(52,211,153,0.7)] animate-edge-sweep"
              style={{ animationDuration: "2.6s" }}
            />
            <span
              className="absolute bottom-0 h-[3px] w-[3px] bg-cyan-300 shadow-[0_0_4px_1px_rgba(34,211,238,0.7)] animate-edge-sweep"
              style={{ animationDuration: "3.1s", animationDirection: "reverse" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
