"use client";

import { useState } from "react";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

function getStoredNumber(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;

  const value = Number.parseInt(localStorage.getItem(key) ?? "", 10);
  return Number.isNaN(value) ? fallback : value;
}

export function useExplorerStore() {
  const [xp, setXp] = useState(() => getStoredNumber("explorer_xp", 150));
  const [scansCount, setScansCount] = useState(() =>
    getStoredNumber("explorer_scans", 2)
  );
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "first_scan",
      title: "First Contact",
      description: "Scanned your first botanical specimen in the field.",
      icon: "🌱",
      unlocked: true,
    },
    {
      id: "botanist",
      title: "Field Taxonomist",
      description: "Analyzed 3 distinct botanical species.",
      icon: "🔍",
      unlocked: false,
    },
    {
      id: "endemic",
      title: "Native Specialist",
      description: "Identified an endemic plant species.",
      icon: "⭐",
      unlocked: true,
    },
    {
      id: "scholar",
      title: "RAG Scholar",
      description: "Queried the botanical assistant 5 times.",
      icon: "📜",
      unlocked: false,
    },
  ]);

  const addScanXp = (isEndemic: boolean) => {
    const newXp = xp + 100;
    const newScans = scansCount + 1;
    setXp(newXp);
    setScansCount(newScans);

    localStorage.setItem("explorer_xp", newXp.toString());
    localStorage.setItem("explorer_scans", newScans.toString());

    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.id === "first_scan" && newScans >= 1) return { ...badge, unlocked: true };
        if (badge.id === "botanist" && newScans >= 3) return { ...badge, unlocked: true };
        if (badge.id === "endemic" && isEndemic) return { ...badge, unlocked: true };
        return badge;
      })
    );
  };

  const level = Math.floor(xp / 200) + 1;
  const currentLevelXp = xp % 200;
  const progressPercent = Math.min((currentLevelXp / 200) * 100, 100);

  return { xp, level, progressPercent, scansCount, badges, addScanXp };
}