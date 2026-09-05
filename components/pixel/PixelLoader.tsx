"use client";

import React from "react";

// Retro sequential-blink loader — a field-instrument alternative to a
// generic spinner, used where the pixel identity should show through.
export function PixelLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Loading">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 bg-emerald-400 animate-pixel-blink"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
