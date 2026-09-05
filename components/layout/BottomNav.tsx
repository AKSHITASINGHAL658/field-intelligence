"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItems";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl bg-[#06080A]/95 border-t border-[#1E2732] px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-90 ${
                isActive
                  ? "text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono tracking-wider font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
