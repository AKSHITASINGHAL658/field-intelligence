"use client";

import React from "react";

interface PixelMascotProps {
  size?: number;
  className?: string;
  expression?: "happy" | "analyzing" | "curious";
}

export function PixelMascot({
  size = 48,
  className = "",
  expression = "happy",
}: PixelMascotProps) {
  // Sprout-OS: Authentic pixel-art botanical frog with sprout on head.
  // Keying by expression forces a remount whenever it changes, which
  // replays the pop-then-idle-bob animation as a small "reaction". The
  // bob itself is skipped while analyzing so it doesn't compete with the
  // scanner's own scanning-laser motion for attention.
  return (
    <svg
      key={expression}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-crisp ${expression !== "analyzing" ? "animate-mascot-idle" : ""} ${className}`}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Sprout Leaves on Head */}
      <rect x="11" y="2" width="2" height="4" fill="#34D399" />
      <rect x="9" y="3" width="2" height="2" fill="#10B981" />
      <rect x="13" y="3" width="2" height="2" fill="#10B981" />
      <rect x="8" y="2" width="1" height="1" fill="#059669" />
      <rect x="15" y="2" width="1" height="1" fill="#059669" />

      {/* Head & Body Outline (Dark Green) */}
      <rect x="5" y="6" width="14" height="13" fill="#064E3B" />

      {/* Main Body (Bright Emerald) */}
      <rect x="6" y="7" width="12" height="11" fill="#10B981" />

      {/* Cheeks / Light Highlights */}
      <rect x="6" y="10" width="2" height="5" fill="#34D399" />
      <rect x="16" y="10" width="2" height="5" fill="#34D399" />
      <rect x="8" y="15" width="8" height="2" fill="#6EE7B7" />

      {/* Eyes */}
      {expression === "happy" && (
        <>
          <rect x="8" y="9" width="2" height="3" fill="#022C22" />
          <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="14" y="9" width="2" height="3" fill="#022C22" />
          <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
        </>
      )}

      {expression === "analyzing" && (
        <>
          {/* Focused scanning eyes */}
          <rect x="8" y="10" width="3" height="1" fill="#06B6D4" />
          <rect x="13" y="10" width="3" height="1" fill="#06B6D4" />
        </>
      )}

      {expression === "curious" && (
        <>
          <rect x="8" y="9" width="2" height="2" fill="#022C22" />
          <rect x="14" y="8" width="2" height="3" fill="#022C22" />
          <rect x="14" y="8" width="1" height="1" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth */}
      <rect x="10" y="13" width="4" height="1" fill="#064E3B" />
      <rect x="11" y="14" width="2" height="1" fill="#F43F5E" />

      {/* Feet */}
      <rect x="4" y="18" width="4" height="2" fill="#059669" />
      <rect x="16" y="18" width="4" height="2" fill="#059669" />
    </svg>
  );
}
