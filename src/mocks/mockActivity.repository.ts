import { IActivityRepository } from '../repositories/activity.repository';
import {
  FarmActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
} from '../types/activity.types';
import { mockDb } from './database';
import { AppError } from '../services/apiError';

export class MockActivityRepository implements IActivityRepository {
  async getActivities(filter?: ActivityFilter): Promise<FarmActivity[]> {
    let list = await mockDb.getActivities();

    if (filter) {
      if (filter.farmId) {
        list = list.filter((a) => a.farmId === filter.farmId);
      }
      if (filter.plantationId) {
        list = list.filter((a) => a.plantationId === filter.plantationId);
      }
      if (filter.type) {
        list = list.filter((a) => a.type === filter.type);
      }
      if (filter.completed !== undefined) {
        list = list.filter((a) => a.completed === filter.completed);
      }
      if (filter.dateFrom) {
        list = list.filter((a) => new Date(a.scheduledAt) >= new Date(filter.dateFrom!));
      }
      if (filter.dateTo) {
        list = list.filter((a) => new Date(a.scheduledAt) <= new Date(filter.dateTo!));
      }
    }

    return list;
  }

  async getActivityById(id: string): Promise<FarmActivity> {
    const act = await mockDb.getActivityById(id);
    if (!act) {
      throw new AppError('NOT_FOUND', `Atividade com ID ${id} não encontrada.`, 404);
    }
    return act;
  }

  async createActivity(input: CreateActivityInput): Promise<FarmActivity> {
    const newActivity: FarmActivity = {
      id: `act-${Date.now()}`,
      farmId: input.farmId,
      plantationId: input.plantationId,
      title: input.title,
      description: input.description,
      type: input.type,
      scheduledAt: input.scheduledAt,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    return mockDb.createActivity(newActivity);
  }

  async updateActivity(input: UpdateActivityInput): Promise<FarmActivity> {
    const existing = await mockDb.getActivityById(input.id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Atividade com ID ${input.id} não encontrada.`, 404);
    }

    const updated: FarmActivity = {
      ...existing,
      farmId: input.farmId ?? existing.farmId,
      plantationId: input.plantationId !== undefined ? input.plantationId : existing.plantationId,
      title: input.title ?? existing.title,
      description: input.description ?? existing.description,
      type: input.type ?? existing.type,
      scheduledAt: input.scheduledAt ?? existing.scheduledAt,
      completed: input.completed !== undefined ? input.completed : existing.completed,
      completedAt: input.completedAt !== undefined ? input.completedAt : existing.completedAt,
    };

    return mockDb.updateActivity(updated);
  }

  async toggleActivityComplete(id: string, completed: boolean): Promise<FarmActivity> {
    const existing = await mockDb.getActivityById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Atividade com ID ${id} não encontrada.`, 404);
    }

    const updated: FarmActivity = {
      ...existing,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    };

    return mockDb.updateActivity(updated);
  }

  async deleteActivity(id: string): Promise<void> {
    const existing = await mockDb.getActivityById(id);
    if (!existing) {
      throw new AppError('NOT_FOUND', `Atividade com ID ${id} não encontrada.`, 404);
    }
    await mockDb.deleteActivity(id);
  }
}
