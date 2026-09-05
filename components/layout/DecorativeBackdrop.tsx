"use client";

import React, { useEffect, useRef } from "react";

// Two faint botanical silhouettes drifting at different rates on scroll.
// Desktop-only (mobile stays compact/uncluttered), purely decorative:
// fixed, behind all content, no pointer events, aria-hidden.
export function DecorativeBackdrop() {
  const slowRef = useRef<HTMLDivElement | null>(null);
  const fastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const applyParallax = () => {
      const y = window.scrollY;
      if (slowRef.current) {
        slowRef.current.style.transform = `translate3d(0, ${y * 0.03}px, 0)`;
      }
      if (fastRef.current) {
        fastRef.current.style.transform = `translate3d(0, ${y * -0.05}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        ref={slowRef}
        className="absolute -top-24 -right-24 text-emerald-500/[0.05]"
      >
        <LeafGlyph size={480} />
      </div>
      <div
        ref={fastRef}
        className="absolute bottom-0 -left-32 text-cyan-500/[0.04]"
      >
        <LeafGlyph size={420} />
      </div>
    </div>
  );
}

function LeafGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
    >
      <path d="M50 95 L50 15" strokeLinecap="round" />
      <path d="M50 75 C35 62 15 68 8 48 C28 45 42 58 50 75 Z" fill="currentColor" />
      <path d="M50 55 C65 42 85 48 92 28 C72 25 58 38 50 55 Z" fill="currentColor" />
      <path d="M50 35 C38 25 25 30 18 15 C36 13 46 24 50 35 Z" fill="currentColor" />
    </svg>
  );
}
