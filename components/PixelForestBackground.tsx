"use client";

import React from "react";

export function PixelForestBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a1208]">
      {/* Retro CRT Scanlines Overlay */}
      <div 
        className="absolute inset-0 z-20 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
          backgroundSize: "100% 4px"
        }}
      />

      {/* Retro Pixel Moon & Stars Layer */}
      <div className="absolute top-6 right-10 w-12 h-12 bg-amber-200 shadow-[0_0_15px_#fef08a] border-4 border-black [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] animate-pulse" />
      <div className="absolute top-12 left-1/4 w-2 h-2 bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />
      <div className="absolute top-20 left-2/3 w-3 h-3 bg-yellow-200 shadow-[0_0_8px_#fef08a]" />
      <div className="absolute top-32 left-10 w-2 h-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />

      {/* Drifting Pixel Forest Spores / Fog Particles */}
      <div className="absolute inset-0 z-10 opacity-40">
        <div className="w-2 h-2 bg-emerald-400 absolute top-1/3 left-10 animate-bounce [animation-duration:3s]" />
        <div className="w-3 h-3 bg-green-300 absolute top-1/2 left-3/4 animate-bounce [animation-duration:4s]" />
        <div className="w-2 h-2 bg-lime-300 absolute top-2/3 left-1/3 animate-bounce [animation-duration:2.5s]" />
      </div>

      {/* Layer 1: Distant Pixel Tree Silhouettes (SVG Pixel Canopy) */}
      <div className="absolute bottom-0 w-full h-48 opacity-30 fill-emerald-950 flex items-end">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,20 L0,12 L5,12 L5,8 L10,8 L10,12 L15,12 L15,5 L20,5 L20,12 L25,12 L25,20 Z 
                   M30,20 L30,10 L35,10 L35,4 L40,4 L40,10 L45,10 L45,20 Z 
                   M50,20 L50,14 L55,14 L55,6 L60,6 L60,14 L65,14 L65,20 Z 
                   M70,20 L70,8 L75,8 L75,3 L80,3 L80,8 L85,8 L85,20 Z 
                   M90,20 L90,11 L95,11 L95,7 L100,7 L100,20 Z" />
        </svg>
      </div>

      {/* Layer 2: Mid-ground Animated Pixel Pines */}
      <div className="absolute bottom-0 w-full h-36 opacity-70 fill-emerald-900 flex items-end">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,20 L0,10 L3,10 L3,6 L6,6 L6,2 L9,2 L9,6 L12,6 L12,10 L15,10 L15,20 Z
                   M20,20 L20,12 L23,12 L23,8 L26,8 L26,4 L29,4 L29,8 L32,8 L32,12 L35,12 L35,20 Z
                   M45,20 L45,9 L48,9 L48,5 L51,5 L51,1 L54,1 L54,5 L57,5 L57,9 L60,9 L60,20 Z
                   M70,20 L70,11 L73,11 L73,7 L76,7 L76,3 L79,3 L79,7 L82,7 L82,11 L85,11 L85,20 Z" />
        </svg>
      </div>

      {/* Layer 3: Foreground Pixel Tree Line & Ground */}
      <div className="absolute bottom-0 w-full h-20 bg-emerald-950 border-t-4 border-emerald-600">
        <div className="w-full h-2 bg-emerald-500" />
      </div>
    </div>
  );
}