"use client";

import React from "react";

export type PixelIconType = "fern" | "flower" | "trillium" | "palm" | "leaf" | "rose";

interface PixelPlantIconProps {
  type?: PixelIconType;
  size?: number;
  className?: string;
}

export function PixelPlantIcon({
  type = "leaf",
  size = 32,
  className = "",
}: PixelPlantIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pixel-crisp ${className}`}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {type === "fern" && (
        <>
          {/* Vertical stem */}
          <rect x="7" y="1" width="2" height="14" fill="#047857" />
          {/* Tier 1 fronds */}
          <rect x="7" y="2" width="2" height="1" fill="#34D399" />
          {/* Tier 2 fronds */}
          <rect x="5" y="4" width="6" height="1" fill="#10B981" />
          <rect x="4" y="5" width="8" height="1" fill="#059669" />
          {/* Tier 3 fronds */}
          <rect x="3" y="7" width="10" height="1" fill="#10B981" />
          <rect x="2" y="8" width="12" height="1" fill="#059669" />
          {/* Tier 4 fronds */}
          <rect x="2" y="10" width="12" height="1" fill="#10B981" />
          <rect x="1" y="11" width="14" height="1" fill="#059669" />
          {/* Base */}
          <rect x="6" y="14" width="4" height="2" fill="#064E3B" />
        </>
      )}

      {type === "trillium" && (
        <>
          {/* Stem */}
          <rect x="7" y="9" width="2" height="6" fill="#047857" />
          {/* Green sepals */}
          <rect x="4" y="9" width="3" height="2" fill="#059669" />
          <rect x="9" y="9" width="3" height="2" fill="#059669" />
          {/* White 3-petals */}
          <rect x="6" y="2" width="4" height="5" fill="#FFFFFF" />
          <rect x="2" y="5" width="5" height="4" fill="#E2E8F0" />
          <rect x="9" y="5" width="5" height="4" fill="#E2E8F0" />
          {/* Yellow center pistil */}
          <rect x="7" y="6" width="2" height="2" fill="#FBBF24" />
        </>
      )}

      {type === "rose" && (
        <>
          {/* Stem & Leaves */}
          <rect x="7" y="8" width="2" height="7" fill="#047857" />
          <rect x="4" y="11" width="3" height="1" fill="#10B981" />
          <rect x="9" y="12" width="3" height="1" fill="#10B981" />
          {/* Magenta / Pink Petals */}
          <rect x="5" y="3" width="6" height="6" fill="#E11D48" />
          <rect x="6" y="2" width="4" height="2" fill="#FB7185" />
          <rect x="4" y="5" width="2" height="3" fill="#BE123C" />
          <rect x="10" y="5" width="2" height="3" fill="#BE123C" />
          <rect x="7" y="5" width="2" height="2" fill="#FFE4E6" />
        </>
      )}

      {(type === "flower" || type === "palm" || type === "leaf") && (
        <>
          {/* Green Foliage Leaf */}
          <rect x="7" y="1" width="2" height="3" fill="#34D399" />
          <rect x="5" y="3" width="6" height="4" fill="#10B981" />
          <rect x="4" y="6" width="8" height="5" fill="#059669" />
          <rect x="6" y="10" width="4" height="3" fill="#047857" />
          <rect x="7" y="13" width="2" height="3" fill="#064E3B" />
          {/* Central vein */}
          <rect x="7" y="4" width="2" height="7" fill="#6EE7B7" />
        </>
      )}
    </svg>
  );
}
