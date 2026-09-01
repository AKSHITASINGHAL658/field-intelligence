export interface Plant {
  id: string;

  commonName: string;
  scientificName: string;
  family: string;

  nativeRegion: string;
  endemic: boolean;

  conservationStatus: string;

  habitat: string;
  ecologicalImportance: string;

  threats: string[];
  conservationActions: string[];

  identificationClues: string[];

  latitude: number;
  longitude: number;

  image: string;
}