"use client";

import { useMemo, useRef } from "react";

// Subtle perspective tilt toward the cursor position, for "collectible
// card" feel. Deliberately capped low (a few degrees) per the brief's
// "avoid excessive 3D tilt" — and paired with an optional lift so it can
// fully replace a Tailwind hover:-translate-y utility (mixing the two
// would fight, since this writes the transform inline).
//
// Implemented as React event-prop handlers (spread onto the element) rather
// than an imperative addEventListener effect: this app's own store hooks
// (useSyncExternalStore-backed) trigger a hydration-driven re-render shortly
// after mount, and empirically an effect-attached native listener could end
// up silently inert after that render — verified directly by dispatching
// synthetic mousemove events and inspecting the resulting style. React's
// synthetic onMouseMove/onMouseLeave don't have that failure mode, since
// they're not tied to a specific effect-run's closure over the DOM node.
export function useTilt<T extends HTMLElement>(maxDeg = 3, liftPx = 4) {
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
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * maxDeg * 2;
        const rotateX = (0.5 - py) * maxDeg * 2;
        el.style.transform = `perspective(700px) translateY(-${liftPx}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      },
      onMouseLeave: () => {
        const el = ref.current;
        if (el) el.style.transform = "";
      },
    }),
    [maxDeg, liftPx]
  );

  return { ref, ...handlers };
}
