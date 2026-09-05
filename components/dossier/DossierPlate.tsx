"use client";

import React from "react";
import { Plant } from "@/types/plant";
import { useExplorerStore } from "@/lib/useExplorerStore";
import { BotanicalPlate } from "./BotanicalPlate";

interface DossierPlateProps {
  plant: Plant;
  className?: string;
}

// Species dossier is server-rendered (it doesn't know about the visitor's
// local collection), but the user's own captured photo for this specimen
// only lives in localStorage. This client-only wrapper bridges the two:
// look up the real record and hand its thumbnail to BotanicalPlate, which
// already falls back to the stock illustration when none exists.
export function DossierPlate({ plant, className }: DossierPlateProps) {
  const { getSpecimenRecord } = useExplorerStore();
  const record = getSpecimenRecord(plant.id);

  return (
    <BotanicalPlate
      plant={plant}
      customThumbnail={record?.thumbnailUrl}
      className={className}
    />
  );
}
