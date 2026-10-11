import { IPlantationRepository } from '../repositories/plantation.repository';
import {
  Plantation,
  CreatePlantationInput,
  UpdatePlantationInput,
  PlantationFilter,
} from '../types/plantation.types';
import { mockDb } from './database';
import { AppError } from '../services/apiError';

export class MockPlantationRepository implements IPlantationRepository {
  async getPlantations(filter?: PlantationFilter): Promise<Plantation[]> {
    let list = await mockDb.getPlantations();

    if (filter) {
      if (filter.farmId) {
        list = list.filter((p) => p.farmId === filter.farmId);
      }
      if (filter.status) {
        list = list.filter((p) => p.status === filter.status);
      }
      if (filter.cropType) {
        list = list.filter((p) => p.cropType === filter.cropType);
      }
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.cropType.toLowerCase().includes(query) ||
            (p.notes && p.notes.toLowerCase().includes(query))
        );
      }
    }

    return list;
  }

  async getPlantationById(id: string): Promise<Plantation> {
    const plt = await mockDb.getPlantationById(id);
    if (!plt) {
      throw new AppError('NOT_FOUND', `Talhão com ID ${id} não encontrado.`, 404);
    }
    return plt;
  }

  async createPlantation(input: CreatePlantationInput): Promise<Plantation> {
    const now = new Date().toISOString();
    const newPlantation: Plantation = {
      id: `plt-${Date.now()}`,
      farmId: input.farmId,
      name: input.name,
      cropType: input.cropType,
      areaHectares: input.areaHectares,
      status: input.status,
      plantedAt: input.plantedAt,
      expectedHarvestAt: input.expectedHarvestAt,
      imageUri: input.imageUri,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    return mockDb.createPlantation(newPlantation);
  }

  async updatePlantation(input: UpdatePlantationInput): Promise<Plantation> {
    const existing = await mockDb.getPlantationById(input.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Talhão com ID ${input.id} não encontrado.`, 404);
    }

    const updated: Plantation = {
      ...existing,
      farmId: input.farmId ?? existing.farmId,
      name: input.name ?? existing.name,
      cropType: input.cropType ?? existing.cropType,
      areaHectares: input.areaHectares ?? existing.areaHectares,
      status: input.status ?? existing.status,
      plantedAt: input.plantedAt ?? existing.plantedAt,
      expectedHarvestAt: input.expectedHarvestAt ?? existing.expectedHarvestAt,
      imageUri: input.imageUri !== undefined ? input.imageUri : existing.imageUri,
      notes: input.notes !== undefined ? input.notes : existing.notes,
      updatedAt: new Date().toISOString(),
    };

    return mockDb.updatePlantation(updated);
  }

  async deletePlantation(id: string): Promise<void> {
    const existing = await mockDb.getPlantationById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Talhão com ID ${id} não encontrado.`, 404);
    }
    await mockDb.deletePlantation(id);
  }
}
