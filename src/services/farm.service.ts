import { farmRepository } from '../repositories';
import { Farm, CreateFarmInput, UpdateFarmInput } from '../types/farm.types';

export const farmService = {
  async getFarms(): Promise<Farm[]> {
    return farmRepository.getFarms();
  },

  async getFarmById(id: string): Promise<Farm> {
    return farmRepository.getFarmById(id);
  },

  async createFarm(input: CreateFarmInput): Promise<Farm> {
    return farmRepository.createFarm(input);
  },

  async updateFarm(input: UpdateFarmInput): Promise<Farm> {
    return farmRepository.updateFarm(input);
  },

  async deleteFarm(id: string): Promise<void> {
    return farmRepository.deleteFarm(id);
  },
};
