import { IFarmRepository } from '../repositories/farm.repository';
import { Farm, CreateFarmInput, UpdateFarmInput } from '../types/farm.types';
import { mockDb } from './database';
import { AppError } from '../services/apiError';

export class MockFarmRepository implements IFarmRepository {
  async getFarms(): Promise<Farm[]> {
    return mockDb.getFarms();
  }

  async getFarmById(id: string): Promise<Farm> {
    const farm = await mockDb.getFarmById(id);
    if (!farm) {
      throw new AppError('NOT_FOUND', `Fazenda com ID ${id} não encontrada.`, 404);
    }
    return farm;
  }

  async createFarm(input: CreateFarmInput): Promise<Farm> {
    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: input.name,
      location: input.location,
      coordinates: input.coordinates,
      totalAreaHectares: input.totalAreaHectares,
      createdAt: new Date().toISOString(),
    };
    return mockDb.createFarm(newFarm);
  }

  async updateFarm(input: UpdateFarmInput): Promise<Farm> {
    const existing = await mockDb.getFarmById(input.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Fazenda com ID ${input.id} não encontrada.`, 404);
    }
    const updated: Farm = {
      ...existing,
      name: input.name ?? existing.name,
      location: input.location ?? existing.location,
      coordinates: input.coordinates ?? existing.coordinates,
      totalAreaHectares: input.totalAreaHectares ?? existing.totalAreaHectares,
    };
    return mockDb.updateFarm(updated);
  }

  async deleteFarm(id: string): Promise<void> {
    const existing = await mockDb.getFarmById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Fazenda com ID ${id} não encontrada.`, 404);
    }
    await mockDb.deleteFarm(id);
  }
}
