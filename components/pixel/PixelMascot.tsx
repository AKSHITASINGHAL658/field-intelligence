"use client";

import React, { useState } from "react";
import { PixelBurst } from "./PixelBurst";

export type MascotExpression =
  | "idle"
  | "happy"
  | "curious"
  | "scanning"
  | "analyzing"
  | "discovery"
  | "confused"
  | "sleeping"
  | "guide";

interface PixelMascotProps {
  size?: number;
  className?: string;
  expression?: MascotExpression;
}

// Field Intelligence's original pixel-art botanical field companion — a
// small frog-like creature with a sprout on its head (Sprout-OS). Built
// entirely from primitive rects, not derived from or resembling any
// existing character (Claude's bug, Minecraft, Pokémon, etc).
//
// Idle motion (bob + blink) plays for calm expressions; "analyzing" and
// "scanning" stay still so they don't compete with the scanner's own
// motion for attention. "discovery" adds a one-shot pixel-burst instead.
export function PixelMascot({
  size = 48,
  className = "",
  expression = "idle",
}: PixelMascotProps) {
  const [hovering, setHovering] = useState(false);
  const shouldBob = !["analyzing", "scanning", "sleeping"].includes(expression);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <svg
        key={expression}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pixel-crisp ${shouldBob ? "animate-mascot-idle" : ""} ${
          hovering && shouldBob ? "scale-110" : ""
        } transition-transform duration-200 ${className}`}
        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
      >
        {/* Sprout Leaves on Head — droops slightly while sleeping */}
        <g style={expression === "sleeping" ? { transform: "rotate(-12deg)", transformOrigin: "12px 3px" } : undefined}>
          <rect x="11" y="2" width="2" height="4" fill="#34D399" />
          <rect x="9" y="3" width="2" height="2" fill="#10B981" />
          <rect x="13" y="3" width="2" height="2" fill="#10B981" />
          <rect x="8" y="2" width="1" height="1" fill="#059669" />
          <rect x="15" y="2" width="1" height="1" fill="#059669" />
        </g>

        {/* Head & Body Outline (Dark Green) */}
        <rect x="5" y="6" width="14" height="13" fill="#064E3B" />

        {/* Main Body (Bright Emerald) */}
        <rect x="6" y="7" width="12" height="11" fill="#10B981" />

        {/* Cheeks / Light Highlights */}
        <rect x="6" y="10" width="2" height="5" fill="#34D399" />
        <rect x="16" y="10" width="2" height="5" fill="#34D399" />
        <rect x="8" y="15" width="8" height="2" fill="#6EE7B7" />

        {/* Eyes — one treatment per expression */}
        {(expression === "idle" || expression === "happy") && (
          <g className="mascot-eyes">
            <rect x="8" y="9" width="2" height="3" fill="#022C22" />
            <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="2" height="3" fill="#022C22" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
          </g>
        )}

        {expression === "curious" && (
          <g className="mascot-eyes">
            <rect x="8" y="9" width="2" height="2" fill="#022C22" />
            <rect x="14" y="8" width="2" height="3" fill="#022C22" />
            <rect x="14" y="8" width="1" height="1" fill="#FFFFFF" />
          </g>
        )}

        {expression === "guide" && (
          <>
            {/* Thoughtful upward gaze */}
            <g className="mascot-eyes">
              <rect x="8" y="8" width="2" height="2" fill="#022C22" />
              <rect x="14" y="8" width="2" height="2" fill="#022C22" />
            </g>
            {/* Tiny research monocle — an original, whimsical detail */}
            <rect x="13" y="7" width="4" height="4" fill="none" stroke="#FBBF24" strokeWidth="0.6" />
            <rect x="17" y="10" width="1" height="2" fill="#FBBF24" />
          </>
        )}

        {(expression === "analyzing" || expression === "scanning") && (
          <>
            <rect
              x="8"
              y="10"
              width="3"
              height="1"
              fill="#06B6D4"
              className={expression === "scanning" ? "animate-mascot-scan-sweep" : ""}
            />
            <rect x="13" y="10" width="3" height="1" fill="#06B6D4" />
          </>
        )}

        {expression === "discovery" && (
          <g>
            <rect x="7" y="8" width="3" height="3" fill="#022C22" />
            <rect x="8" y="9" width="1" height="1" fill="#FDE68A" />
            <rect x="14" y="8" width="3" height="3" fill="#022C22" />
            <rect x="15" y="9" width="1" height="1" fill="#FDE68A" />
          </g>
        )}

        {expression === "confused" && (
          <g>
            <rect x="8" y="9" width="2" height="2" fill="#022C22" />
            <rect x="14" y="10" width="2" height="1" fill="#022C22" />
            {/* Tilted brow mark for a puzzled look */}
            <rect x="13" y="8" width="3" height="1" fill="#022C22" transform="rotate(-15 14 8)" />
          </g>
        )}

        {expression === "sleeping" && (
          <>
            <rect x="7" y="10" width="3" height="1" fill="#022C22" />
            <rect x="14" y="10" width="3" height="1" fill="#022C22" />
          </>
        )}

        {/* Mouth — expression-specific */}
        {expression === "confused" ? (
          <>
            <rect x="10" y="13" width="1" height="1" fill="#064E3B" />
            <rect x="11" y="14" width="1" height="1" fill="#064E3B" />
            <rect x="12" y="13" width="1" height="1" fill="#064E3B" />
            <rect x="13" y="14" width="1" height="1" fill="#064E3B" />
          </>
        ) : expression === "discovery" ? (
          <>
            <rect x="9" y="13" width="6" height="2" fill="#064E3B" />
            <rect x="10" y="14" width="4" height="1" fill="#F43F5E" />
          </>
        ) : expression === "sleeping" ? (
          <rect x="11" y="14" width="2" height="1" fill="#064E3B" />
        ) : (
          <>
            <rect x="10" y="13" width="4" height="1" fill="#064E3B" />
            <rect x="11" y="14" width="2" height="1" fill="#F43F5E" />
          </>
        )}

        {/* Feet */}
        <rect x="4" y="18" width="4" height="2" fill="#059669" />
        <rect x="16" y="18" width="4" height="2" fill="#059669" />
      </svg>

      {/* Sleeping "zzz" drift */}
      {expression === "sleeping" && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 text-[8px] font-mono font-bold text-emerald-400 animate-mascot-zzz"
        >
          z
        </span>
      )}

      {/* Discovery celebration burst */}
      {expression === "discovery" && <PixelBurst triggerKey="mascot-discovery" />}
    </span>
  );
}
