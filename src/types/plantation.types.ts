export type CropType =
  | 'SOY'
  | 'CORN'
  | 'COFFEE'
  | 'WHEAT'
  | 'RICE'
  | 'POTATO'
  | 'APPLE'
  | 'COTTON'
  | 'SUGARCANE'
  | 'OTHER';

export type PlantationStatus =
  | 'PLANNED'
  | 'SOWING'
  | 'GROWING'
  | 'HARVEST_READY'
  | 'HARVESTED';

export interface Plantation {
  id: string;
  farmId: string;
  name: string;
  cropType: CropType;
  areaHectares: number;
  status: PlantationStatus;
  plantedAt: string;
  expectedHarvestAt: string;
  imageUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlantationInput {
  farmId: string;
  name: string;
  cropType: CropType;
  areaHectares: number;
  status: PlantationStatus;
  plantedAt: string;
  expectedHarvestAt: string;
  imageUri?: string;
  notes?: string;
}

export interface UpdatePlantationInput extends Partial<CreatePlantationInput> {
  id: string;
}

export interface PlantationFilter {
  farmId?: string;
  status?: PlantationStatus;
  cropType?: CropType;
  searchQuery?: string;
}
