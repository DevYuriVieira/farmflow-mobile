import { plantationRepository } from '../repositories';
import {
  Plantation,
  CreatePlantationInput,
  UpdatePlantationInput,
  PlantationFilter,
} from '../types/plantation.types';

export const plantationService = {
  async getPlantations(filter?: PlantationFilter): Promise<Plantation[]> {
    return plantationRepository.getPlantations(filter);
  },

  async getPlantationById(id: string): Promise<Plantation> {
    return plantationRepository.getPlantationById(id);
  },

  async createPlantation(input: CreatePlantationInput): Promise<Plantation> {
    return plantationRepository.createPlantation(input);
  },

  async updatePlantation(input: UpdatePlantationInput): Promise<Plantation> {
    return plantationRepository.updatePlantation(input);
  },

  async deletePlantation(id: string): Promise<void> {
    return plantationRepository.deletePlantation(id);
  },
};
