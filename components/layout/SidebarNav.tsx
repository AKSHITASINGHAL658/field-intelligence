"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { NAV_ITEMS } from "./navItems";

// Desktop-only companion to BottomNav. Fixed left column so page content can
// reserve space for it with a matching lg:pl-64 on the shell.
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-[#1E2732] bg-[#06080A]">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-6 py-6 border-b border-[#1E2732]"
      >
        <div className="h-9 w-9 rounded-lg bg-[#0C1015] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Leaf className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white">
            FIELD INTELLIGENCE
          </div>
          <div className="text-[10px] font-mono tracking-widest text-zinc-500">
            FIELD STATION
          </div>
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all active:scale-95 ${
                isActive
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "text-zinc-500 border border-transparent hover:text-zinc-200 hover:bg-[#0C1015] hover:translate-x-0.5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-[#1E2732] text-[10px] font-mono text-zinc-600 tracking-wider">
        CAMPUS BOTANICAL SURVEY
      </div>
    </aside>
  );
}
