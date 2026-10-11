import { activityRepository } from '../repositories';
import {
  FarmActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
} from '../types/activity.types';

export const activityService = {
  async getActivities(filter?: ActivityFilter): Promise<FarmActivity[]> {
    return activityRepository.getActivities(filter);
  },

  async getActivityById(id: string): Promise<FarmActivity> {
    return activityRepository.getActivityById(id);
  },

  async createActivity(input: CreateActivityInput): Promise<FarmActivity> {
    return activityRepository.createActivity(input);
  },

  async updateActivity(input: UpdateActivityInput): Promise<FarmActivity> {
    return activityRepository.updateActivity(input);
  },

  async toggleActivityComplete(id: string, completed: boolean): Promise<FarmActivity> {
    return activityRepository.toggleActivityComplete(id, completed);
  },

  async deleteActivity(id: string): Promise<void> {
    return activityRepository.deleteActivity(id);
  },
};
