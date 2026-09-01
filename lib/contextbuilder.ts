import { Plant } from "@/types/plant";

export function buildPlantContext(plant: Plant): string {
  return `
PLANT INFORMATION

Common Name:
${plant.commonName}

Scientific Name:
${plant.scientificName}

Family:
${plant.family}

Native Region:
${plant.nativeRegion}

Endemic:
${plant.endemic ? "Yes" : "No"}

Conservation Status:
${plant.conservationStatus}

Habitat:
${plant.habitat}

Ecological Importance:
${plant.ecologicalImportance}

Threats:
${plant.threats.join(", ")}

Conservation Actions:
${plant.conservationActions.join(", ")}

Identification Clues:
${plant.identificationClues.join(", ")}
`;
}