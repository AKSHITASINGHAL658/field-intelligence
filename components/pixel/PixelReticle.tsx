"use client";

import React from "react";

interface PixelReticleProps {
  scanning?: boolean;
}

export function PixelReticle({ scanning = false }: PixelReticleProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* 4 Optical Corner Brackets */}
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        {/* Top Left */}
        <div
          className={`absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-emerald-400 transition-opacity ${
            scanning ? "animate-pulse-gentle" : ""
          }`}
        />
        {/* Top Right */}
        <div
          className={`absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-emerald-400 transition-opacity ${
            scanning ? "animate-pulse-gentle" : ""
          }`}
        />
        {/* Bottom Left */}
        <div
          className={`absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-emerald-400 transition-opacity ${
            scanning ? "animate-pulse-gentle" : ""
          }`}
        />
        {/* Bottom Right */}
        <div
          className={`absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-emerald-400 transition-opacity ${
            scanning ? "animate-pulse-gentle" : ""
          }`}
        />

        {/* Center Crosshair [+] */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-6 w-6 border border-emerald-400/60 flex items-center justify-center">
            <span className="text-emerald-400 text-xs font-mono font-bold leading-none">+</span>
          </div>
        </div>

        {/* Laser scanline when actively processing */}
        {scanning && (
          <div className="absolute inset-x-2 top-0 h-0.5 animate-scan-laser bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.9)]" />
        )}
      </div>
    </div>
  );
}
