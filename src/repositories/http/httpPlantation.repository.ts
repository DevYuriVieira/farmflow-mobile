import { IPlantationRepository } from '../plantation.repository';
import {
  Plantation,
  CreatePlantationInput,
  UpdatePlantationInput,
  PlantationFilter,
} from '../../types/plantation.types';
import { apiClient } from '../../services/api';

export class HttpPlantationRepository implements IPlantationRepository {
  async getPlantations(filter?: PlantationFilter): Promise<Plantation[]> {
    const response = await apiClient.get<Plantation[]>('/plantations', {
      params: filter,
    });
    return response.data;
  }

  async getPlantationById(id: string): Promise<Plantation> {
    const response = await apiClient.get<Plantation>(`/plantations/${id}`);
    return response.data;
  }

  async createPlantation(input: CreatePlantationInput): Promise<Plantation> {
    const response = await apiClient.post<Plantation>('/plantations', input);
    return response.data;
  }

  async updatePlantation(input: UpdatePlantationInput): Promise<Plantation> {
    const response = await apiClient.put<Plantation>(`/plantations/${input.id}`, input);
    return response.data;
  }

  async deletePlantation(id: string): Promise<void> {
    await apiClient.delete(`/plantations/${id}`);
  }
}
