"use client";

import { useSyncExternalStore } from "react";
import { plants } from "@/data/plantDatabase";

export interface DiscoveredSpecimenRecord {
  speciesId: string;
  firstDiscoveredAt: string;
  lastObservedAt: string;
  observationCount: number;
  bestConfidence: number;
  thumbnailUrl?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const STORAGE_KEY_DISCOVERIES = "field_discoveries_v1";
const STORAGE_KEY_EXP = "field_exp_v1";
const STORAGE_KEY_SCANS = "field_total_scans_v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("storage_change"));
  } catch (err) {
    console.error(`Failed to persist ${key}:`, err);
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage_change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useExplorerStore() {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const rawDiscoveries = useSyncExternalStore(
    subscribe,
    () => {
      const val = localStorage.getItem(STORAGE_KEY_DISCOVERIES);
      return val ?? "{}";
    },
    () => "{}"
  );

  const rawExp = useSyncExternalStore(
    subscribe,
    () => {
      const val = localStorage.getItem(STORAGE_KEY_EXP);
      return val ?? "0";
    },
    () => "0"
  );

  const rawScans = useSyncExternalStore(
    subscribe,
    () => {
      const val = localStorage.getItem(STORAGE_KEY_SCANS);
      return val ?? "0";
    },
    () => "0"
  );

  let discovered: Record<string, DiscoveredSpecimenRecord> = {};
  try {
    discovered = JSON.parse(rawDiscoveries);
  } catch {
    discovered = {};
  }

  const exp = Number.parseInt(rawExp, 10) || 0;
  const totalScans = Number.parseInt(rawScans, 10) || 0;

  const totalCatalogCount = plants.length; // Exactly 7
  const discoveredCount = Object.keys(discovered).length;

  const isDiscovered = (speciesId: string): boolean => {
    return Boolean(discovered[speciesId]);
  };

  const getSpecimenRecord = (speciesId: string): DiscoveredSpecimenRecord | null => {
    return discovered[speciesId] ?? null;
  };

  const recordObservation = (
    speciesId: string,
    confidence: number,
    thumbnailUrl?: string
  ): { isNew: boolean; expGained: number } => {
    const plant = plants.find((p) => p.id === speciesId);
    const currentDiscovered = loadFromStorage<Record<string, DiscoveredSpecimenRecord>>(
      STORAGE_KEY_DISCOVERIES,
      {}
    );
    const isNew = !currentDiscovered[speciesId];
    const now = new Date().toISOString();

    const expGained = isNew ? (plant?.endemic ? 150 : 100) : 25;
    const currentExp = loadFromStorage<number>(STORAGE_KEY_EXP, 0);
    const currentScans = loadFromStorage<number>(STORAGE_KEY_SCANS, 0);

    const existingRecord = currentDiscovered[speciesId];
    const updatedRecord: DiscoveredSpecimenRecord = existingRecord
      ? {
          ...existingRecord,
          lastObservedAt: now,
          observationCount: existingRecord.observationCount + 1,
          bestConfidence: Math.max(existingRecord.bestConfidence, confidence),
          thumbnailUrl: thumbnailUrl ?? existingRecord.thumbnailUrl,
        }
      : {
          speciesId,
          firstDiscoveredAt: now,
          lastObservedAt: now,
          observationCount: 1,
          bestConfidence: confidence,
          thumbnailUrl,
        };

    const newDiscovered = {
      ...currentDiscovered,
      [speciesId]: updatedRecord,
    };

    saveToStorage(STORAGE_KEY_DISCOVERIES, newDiscovered);
    saveToStorage(STORAGE_KEY_EXP, currentExp + expGained);
    saveToStorage(STORAGE_KEY_SCANS, currentScans + 1);

    return { isNew, expGained };
  };

  const level = Math.floor(exp / 200) + 1;
  const currentLevelExp = exp % 200;
  const progressPercent = Math.min((currentLevelExp / 200) * 100, 100);
  const observations = Object.values(discovered).map((record) => ({
    ...record,
    plantId: record.speciesId,
    timestamp: record.lastObservedAt,
  }));

  const badges: Badge[] = [
    {
      id: "first_scan",
      title: "First Contact",
      description: "Scanned your first verified botanical specimen.",
      icon: "🌱",
      unlocked: discoveredCount >= 1,
    },
    {
      id: "botanist",
      title: "Field Taxonomist",
      description: "Catalogued 3 distinct campus plant species.",
      icon: "🔍",
      unlocked: discoveredCount >= 3,
    },
    {
      id: "endemic",
      title: "Native Specialist",
      description: "Discovered the endemic species Cleistanthus collinus.",
      icon: "⭐",
      unlocked: Boolean(discovered["plant-07"]),
    },
    {
      id: "master",
      title: "Flora Master",
      description: "Completed the entire 7-species campus botanical index.",
      icon: "🏆",
      unlocked: discoveredCount >= totalCatalogCount,
    },
  ];

  return {
    isHydrated,
    discovered,
    discoveredCount,
    totalCatalogCount,
    exp,
    totalXp: exp,
    level,
    progressPercent,
    totalScans,
    badges,
    observations,
    isDiscovered,
    getSpecimenRecord,
    recordObservation,
  };
}