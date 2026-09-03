import { Plant } from "./plant";

export interface ClassificationResult {
  success: boolean;
  speciesId?: string;
  confidence?: number;
  reason?: string;
}

// What POST /api/classify returns: the client's raw classification result,
// enriched with the matching plant record (when one exists in the database).
export interface ClassifyResponse {
  success: boolean;
  speciesId?: string;
  confidence?: number;
  reason?: string;
  plant?: Plant;
}

export interface GuideRequest {
  plantId: string;
  question: string;
}

export interface GuideResponse {
  answer: string;
}