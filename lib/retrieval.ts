import { getPlantById } from "@/data/plantDatabase";
import { Plant } from "@/types/plant";

export function retrievePlantContext(
  plantId: string
): Plant | null {
  const plant = getPlantById(plantId);

  if (!plant) {
    return null;
  }

  return plant;
}