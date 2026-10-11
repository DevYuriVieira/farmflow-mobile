import {
  FarmActivity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
} from '../types/activity.types';

export interface IActivityRepository {
  getActivities(filter?: ActivityFilter): Promise<FarmActivity[]>;
  getActivityById(id: string): Promise<FarmActivity>;
  createActivity(input: CreateActivityInput): Promise<FarmActivity>;
  updateActivity(input: UpdateActivityInput): Promise<FarmActivity>;
  toggleActivityComplete(id: string, completed: boolean): Promise<FarmActivity>;
  deleteActivity(id: string): Promise<void>;
}
