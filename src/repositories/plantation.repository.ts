import {
  Plantation,
  CreatePlantationInput,
  UpdatePlantationInput,
  PlantationFilter,
} from '../types/plantation.types';

export interface IPlantationRepository {
  getPlantations(filter?: PlantationFilter): Promise<Plantation[]>;
  getPlantationById(id: string): Promise<Plantation>;
  createPlantation(input: CreatePlantationInput): Promise<Plantation>;
  updatePlantation(input: UpdatePlantationInput): Promise<Plantation>;
  deletePlantation(id: string): Promise<void>;
}
