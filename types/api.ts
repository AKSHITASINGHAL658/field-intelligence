export interface ClassificationResult {
  success: boolean;
  speciesId?: string;
  confidence?: number;
  reason?: string;
}

export interface GuideRequest {
  plantId: string;
  question: string;
}

export interface GuideResponse {
  answer: string;
}