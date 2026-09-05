"use client";

import { useMemo, useRef } from "react";

// Subtly pulls an element toward the cursor when it's nearby, for a
// "magnetic button" feel. Mutates style directly (no React state / re-render)
// so it stays cheap.
//
// Implemented as React event-prop handlers rather than an imperative
// addEventListener effect — see useTilt.ts for why: an effect-attached
// native listener on a component-scoped ref was empirically found to go
// silently inert after this app's useSyncExternalStore-backed store hooks
// trigger their post-hydration re-render. React's synthetic mouse props
// don't share that failure mode.
export function useMagnetic<T extends HTMLElement>(strength = 10) {
  const ref = useRef<T | null>(null);
  const enabledRef = useRef<boolean | null>(null);

  const isEnabled = () => {
    if (enabledRef.current === null) {
      enabledRef.current =
        typeof window !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.matchMedia("(pointer: fine)").matches;
    }
    return enabledRef.current;
  };

  const handlers = useMemo(
    () => ({
      onMouseMove: (e: React.MouseEvent<T>) => {
        const el = ref.current;
        if (!el || !isEnabled()) return;

        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const maxDistance = Math.max(rect.width, rect.height);
        const distance = Math.sqrt(relX * relX + relY * relY);
        if (distance > maxDistance) return;

        const pull = 1 - distance / maxDistance;
        el.style.transform = `translate(${(relX / maxDistance) * strength * pull}px, ${
          (relY / maxDistance) * strength * pull
        }px)`;
      },
      onMouseLeave: () => {
        const el = ref.current;
        if (el) el.style.transform = "";
      },
    }),
    [strength]
  );

  return { ref, ...handlers };
}
