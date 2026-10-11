import { IFarmRepository } from '../farm.repository';
import { Farm, CreateFarmInput, UpdateFarmInput } from '../../types/farm.types';
import { apiClient } from '../../services/api';

export class HttpFarmRepository implements IFarmRepository {
  async getFarms(): Promise<Farm[]> {
    const response = await apiClient.get<Farm[]>('/farms');
    return response.data;
  }

  async getFarmById(id: string): Promise<Farm> {
    const response = await apiClient.get<Farm>(`/farms/${id}`);
    return response.data;
  }

  async createFarm(input: CreateFarmInput): Promise<Farm> {
    const response = await apiClient.post<Farm>('/farms', input);
    return response.data;
  }

  async updateFarm(input: UpdateFarmInput): Promise<Farm> {
    const response = await apiClient.put<Farm>(`/farms/${input.id}`, input);
    return response.data;
  }

  async deleteFarm(id: string): Promise<void> {
    await apiClient.delete(`/farms/${id}`);
  }
}
