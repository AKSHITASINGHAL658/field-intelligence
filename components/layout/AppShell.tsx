"use client";

import React from "react";
import Link from "next/link";
import { User, Leaf } from "lucide-react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06080A] text-[#F1F5F9] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#06080A]/90 border-b border-[#1E2732] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#0C1015] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                FIELD INTELLIGENCE
              </div>
              <div className="text-[10px] font-mono tracking-widest text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FIELD STATION ONLINE
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#0C1015] border border-[#1E2732] flex items-center justify-center text-zinc-400">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 pb-24">{children}</main>

      {/* Global Navigation Dock */}
      <BottomNav />
    </div>
  );
}
