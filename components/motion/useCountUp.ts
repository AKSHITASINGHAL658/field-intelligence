"use client";

import { useEffect, useState } from "react";

// Animates a number from 0 up to `target` over `durationMs`, using a single
// short-lived requestAnimationFrame loop (it stops itself once the value
// reaches the target — not a continuously running loop). Renders the final
// value immediately under prefers-reduced-motion.
export function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rafId = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(rafId);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return value;
}
