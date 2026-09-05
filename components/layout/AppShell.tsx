"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Leaf } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";
import { DecorativeBackdrop } from "./DecorativeBackdrop";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { PixelBurst } from "@/components/pixel/PixelBurst";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [brandHover, setBrandHover] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#06080A] text-[#F1F5F9] font-sans">
      <DecorativeBackdrop />
      <CursorGlow />

      {/* Desktop Sidebar (fixed, own column) */}
      <SidebarNav />

      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#06080A]/90 border-b border-[#1E2732] px-4 py-3 lg:px-8">
          <div className="max-w-6xl mx-auto lg:max-w-none flex items-center justify-between">
            {/* Brand — mobile/tablet only, desktop shows it in the sidebar instead */}
            <Link
              href="/"
              className="group relative flex items-center gap-3 lg:hidden"
              onMouseEnter={() => setBrandHover(true)}
              onMouseLeave={() => setBrandHover(false)}
            >
              <div className="relative h-10 w-10 rounded-lg bg-[#0C1015] border border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]">
                <Leaf className="w-5 h-5" />
                {brandHover && <PixelBurst triggerKey="mobile-brand" />}
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight text-white leading-none transition-colors duration-300 group-hover:text-emerald-50">
                  FIELD INTELLIGENCE
                </div>
                <div className="text-[10px] font-mono tracking-widest text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  FIELD STATION ONLINE
                </div>
              </div>
            </Link>

            {/* Desktop-only status readout, replaces the brand block */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FIELD STATION ONLINE
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#0C1015] border border-[#1E2732] flex items-center justify-center text-zinc-400">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 pb-24 lg:pb-10 animate-page-in">{children}</main>
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
