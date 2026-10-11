export type ActivityType =
  | 'IRRIGATION'
  | 'FERTILIZATION'
  | 'PEST_CONTROL'
  | 'PLANTING'
  | 'HARVEST'
  | 'SOIL_ANALYSIS'
  | 'PRUNING'
  | 'OTHER';

export interface FarmActivity {
  id: string;
  farmId: string;
  plantationId?: string;
  title: string;
  description: string;
  type: ActivityType;
  scheduledAt: string;
  completedAt?: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateActivityInput {
  farmId: string;
  plantationId?: string;
  title: string;
  description: string;
  type: ActivityType;
  scheduledAt: string;
}

export interface UpdateActivityInput extends Partial<CreateActivityInput> {
  id: string;
  completed?: boolean;
  completedAt?: string;
}

export interface ActivityFilter {
  farmId?: string;
  plantationId?: string;
  type?: ActivityType;
  completed?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
