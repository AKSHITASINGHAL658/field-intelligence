"use client";

import React, { useEffect, useRef } from "react";

// A soft emerald tint that follows the pointer on desktop. Built from a
// radial-gradient rather than a blurred solid so there's no expensive blur
// compositing — only a cheap, GPU-composited transform changes per frame.
// Desktop (pointer: fine) only, and skipped entirely under
// prefers-reduced-motion.
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const apply = () => {
      el.style.transform = `translate3d(${targetX - 250}px, ${targetY - 250}px, 0)`;
      rafId = 0;
    };

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-glow hidden lg:block fixed top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full pointer-events-none"
    />
  );
}
