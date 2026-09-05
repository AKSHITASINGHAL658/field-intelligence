"use client";

import React from "react";
import Image from "next/image";

export function PixelForestBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05110b]">
      {/* Custom Keyframe Animations for Roaming Characters */}
      <style>{`
        @keyframes walk-patrol {
          0% { transform: translateX(0) scaleX(1); }
          48% { transform: translateX(200px) scaleX(1); }
          50% { transform: translateX(200px) scaleX(-1); }
          98% { transform: translateX(0) scaleX(-1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        @keyframes hop-patrol {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, -10px); }
          50% { transform: translate(100px, 0); }
          75% { transform: translate(50px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-sway {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        .animate-walk {
          animation: walk-patrol 16s ease-in-out infinite;
        }
        .animate-hop {
          animation: hop-patrol 9s ease-in-out infinite;
        }
        .animate-sway {
          animation: float-sway 4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Static Image Background (Loaded from public/plants.png or public/plants.jpg) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/plants.png" // Change extension to .jpg if you saved as plants.jpg
          alt="Pixel Forest Background"
          fill
          priority
          unoptimized
          className="object-cover object-center image-rendering-pixelated"
        />
      </div>

      {/* 2. Optional Soft Atmospheric Overlay & Scanlines */}
      <div className="absolute inset-0 z-10 bg-emerald-950/20 mix-blend-multiply pointer-events-none" />
      <div 
        className="absolute inset-0 z-10 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
          backgroundSize: "100% 4px"
        }}
      />

      {/* 3. Floating Sunlit Particles */}
      <div className="absolute inset-0 z-15 opacity-70">
        <div className="w-1.5 h-1.5 bg-emerald-200 absolute top-1/3 left-1/4 animate-bounce [animation-duration:4s] shadow-[0_0_8px_#a7f3d0]" />
        <div className="w-2 h-2 bg-lime-300 absolute top-1/2 left-1/2 animate-bounce [animation-duration:5s] shadow-[0_0_10px_#bef264]" />
        <div className="w-1.5 h-1.5 bg-teal-200 absolute top-2/3 left-3/4 animate-bounce [animation-duration:3.5s]" />
      </div>

      {/* 4. ANIMATED ROAMING PIXEL PLANT CHARACTERS */}

      {/* Character 1: Walking Sprout Mascot in Forest Center */}
      <div className="absolute bottom-[14%] left-[28%] z-20 animate-walk">
        <div className="relative p-1 bg-black/80 border border-emerald-400 rounded shadow-[0_0_10px_#52b788]">
          <svg width="24" height="24" viewBox="0 0 16 16">
            <path d="M7 1h2v3H7z" className="fill-lime-300" />
            <path d="M5 2h2v2H5zM9 2h2v2H9z" className="fill-emerald-400" />
            <path d="M4 4h8v8H4z" className="fill-emerald-500" />
            <path d="M6 6h1v3H6zM9 6h1v3H9z" className="fill-black" />
            <path d="M6 6h1v1H6zM9 6h1v1H9z" className="fill-white" />
            <path d="M5 12h2v3H5zM9 12h2v3H9z" className="fill-emerald-700" />
          </svg>
        </div>
      </div>

      {/* Character 2: Hopping Mushroom Mascot Near Left Tree Trunk */}
      <div className="absolute bottom-[16%] left-[10%] z-20 animate-hop">
        <div className="relative p-1 bg-black/80 border border-teal-300 rounded shadow-[0_0_8px_#a7f3d0]">
          <svg width="22" height="22" viewBox="0 0 16 16">
            <path d="M3 2h10v2H3zM1 4h14v4H1z" className="fill-teal-400" />
            <path d="M3 4h2v2H3zM10 5h3v2h-3z" className="fill-emerald-100" />
            <path d="M5 8h6v6H5z" className="fill-emerald-100" />
            <path d="M6 10h1v2H6zM9 10h1v2H9z" className="fill-black" />
          </svg>
        </div>
      </div>

      {/* Character 3: Swaying Floating Seedling Under Tree Canopy */}
      <div className="absolute top-[32%] right-[25%] z-20 animate-sway">
        <div className="relative p-1 bg-black/80 border border-lime-400 rounded shadow-[0_0_10px_#bef264]">
          <svg width="20" height="20" viewBox="0 0 16 16">
            <path d="M7 1h2v4H7z" className="fill-amber-600" />
            <path d="M4 5h8v6H4z" className="fill-lime-400" />
            <path d="M2 3h4v3H2zM10 3h4v3h-4z" className="fill-emerald-300" />
            <path d="M6 7h1v2H6zM9 7h1v2H9z" className="fill-black" />
          </svg>
        </div>
      </div>

      {/* Character 4: Peeking Bush Mascot on Right Trunk Base */}
      <div className="absolute bottom-[18%] right-[14%] z-20 animate-bounce [animation-duration:3s]">
        <div className="relative p-1 bg-black/80 border border-emerald-300 rounded shadow-[0_0_8px_#34d399]">
          <svg width="22" height="22" viewBox="0 0 16 16">
            <path d="M2 4h12v8H2z" className="fill-emerald-600" />
            <path d="M4 2h8v2H4zM4 12h8v2H4z" className="fill-emerald-500" />
            <path d="M5 6h2v2H5zM9 6h2v2H9z" className="fill-black" />
            <path d="M6 9h4v1H6z" className="fill-emerald-300" />
          </svg>
        </div>
      </div>

    </div>
  );
}