export interface FarmCoordinates {
  latitude: number;
  longitude: number;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  coordinates: FarmCoordinates;
  totalAreaHectares: number;
  createdAt: string;
}

export interface CreateFarmInput {
  name: string;
  location: string;
  coordinates: FarmCoordinates;
  totalAreaHectares: number;
}

export interface UpdateFarmInput extends Partial<CreateFarmInput> {
  id: string;
}
