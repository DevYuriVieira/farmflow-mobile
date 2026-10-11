import { IActivityRepository } from '../activity.repository';
import {
  FarmActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
} from '../../types/activity.types';
import { apiClient } from '../../services/api';

export class HttpActivityRepository implements IActivityRepository {
  async getActivities(filter?: ActivityFilter): Promise<FarmActivity[]> {
    const response = await apiClient.get<FarmActivity[]>('/activities', {
      params: filter,
    });
    return response.data;
  }

  async getActivityById(id: string): Promise<FarmActivity> {
    const response = await apiClient.get<FarmActivity>(`/activities/${id}`);
    return response.data;
  }

  async createActivity(input: CreateActivityInput): Promise<FarmActivity> {
    const response = await apiClient.post<FarmActivity>('/activities', input);
    return response.data;
  }

  async updateActivity(input: UpdateActivityInput): Promise<FarmActivity> {
    const response = await apiClient.put<FarmActivity>(`/activities/${input.id}`, input);
    return response.data;
  }

  async toggleActivityComplete(id: string, completed: boolean): Promise<FarmActivity> {
    const response = await apiClient.patch<FarmActivity>(`/activities/${id}/status`, {
      completed,
    });
    return response.data;
  }

  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/activities/${id}`);
  }
}
