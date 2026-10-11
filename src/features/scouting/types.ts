export type PestSeverity = 'LOW' | 'MEDIUM' | 'CRITICAL';
export type PestTargetType = 'INSECT' | 'DISEASE' | 'WEED';

export interface PestCatalogItem {
  id: string;
  name: string;
  scientificName: string;
  type: PestTargetType;
  crop: 'SOY' | 'CORN' | 'COFFEE' | 'GENERAL';
  economicDamageThreshold: string;
  recommendedControl: string;
  chemicalOrBiologicalActive: string;
  typicalSymptoms: string;
}

export interface ScoutingRecord {
  id: string;
  farmId: string;
  plantationId?: string;
  plantationName: string;
  pestId: string;
  pestName: string;
  severity: PestSeverity;
  affectedPlantsPercent: number; // Ex: 15% das plantas com sintomas
  locationNote: string;
  latitude?: number;
  longitude?: number;
  imageUri?: string;
  aiConfidencePercent?: number;
  aiDiagnosisLabel?: string;
  notes?: string;
  actionTaken: boolean;
  createdAt: string;
}
