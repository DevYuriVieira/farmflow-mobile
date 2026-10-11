import { Farm, CreateFarmInput, UpdateFarmInput } from '../types/farm.types';

export interface IFarmRepository {
  getFarms(): Promise<Farm[]>;
  getFarmById(id: string): Promise<Farm>;
  createFarm(input: CreateFarmInput): Promise<Farm>;
  updateFarm(input: UpdateFarmInput): Promise<Farm>;
  deleteFarm(id: string): Promise<void>;
}
