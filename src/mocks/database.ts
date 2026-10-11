import AsyncStorage from '@react-native-async-storage/async-storage';
import { Farm } from '../types/farm.types';
import { Plantation } from '../types/plantation.types';
import { FarmActivity } from '../types/activity.types';
import { seedFarms, seedPlantations, seedActivities } from './seed';

const STORAGE_KEY_FARMS = '@farmflow/mock_farms';
const STORAGE_KEY_PLANTATIONS = '@farmflow/mock_plantations';
const STORAGE_KEY_ACTIVITIES = '@farmflow/mock_activities';

class MockDatabase {
  private farms: Farm[] = [...seedFarms];
  private plantations: Plantation[] = [...seedPlantations];
  private activities: FarmActivity[] = [...seedActivities];
  private initialized: boolean = false;
  private latencyMs: number = 250;

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const [savedFarms, savedPlantations, savedActivities] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_FARMS),
        AsyncStorage.getItem(STORAGE_KEY_PLANTATIONS),
        AsyncStorage.getItem(STORAGE_KEY_ACTIVITIES),
      ]);

      if (savedFarms) {
        this.farms = JSON.parse(savedFarms) as Farm[];
      }
      if (savedPlantations) {
        this.plantations = JSON.parse(savedPlantations) as Plantation[];
      }
      if (savedActivities) {
        this.activities = JSON.parse(savedActivities) as FarmActivity[];
      }
    } catch {
      // Fallback to seed data
      this.farms = [...seedFarms];
      this.plantations = [...seedPlantations];
      this.activities = [...seedActivities];
    } finally {
      this.initialized = true;
    }
  }

  private async persist(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(this.farms)),
        AsyncStorage.setItem(STORAGE_KEY_PLANTATIONS, JSON.stringify(this.plantations)),
        AsyncStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(this.activities)),
      ]);
    } catch (e) {
      console.warn('Failed to persist mock database changes', e);
    }
  }

  private async delay(): Promise<void> {
    if (this.latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    }
  }

  public async getFarms(): Promise<Farm[]> {
    await this.init();
    await this.delay();
    return JSON.parse(JSON.stringify(this.farms)) as Farm[];
  }

  public async getFarmById(id: string): Promise<Farm | null> {
    await this.init();
    await this.delay();
    const farm = this.farms.find((f) => f.id === id);
    return farm ? (JSON.parse(JSON.stringify(farm)) as Farm) : null;
  }

  public async createFarm(farm: Farm): Promise<Farm> {
    await this.init();
    await this.delay();
    this.farms.unshift(farm);
    await this.persist();
    return JSON.parse(JSON.stringify(farm)) as Farm;
  }

  public async updateFarm(farm: Farm): Promise<Farm> {
    await this.init();
    await this.delay();
    const idx = this.farms.findIndex((f) => f.id === farm.id);
    if (idx === -1) throw new Error(`Fazenda com ID ${farm.id} não encontrada.`);
    this.farms[idx] = farm;
    await this.persist();
    return JSON.parse(JSON.stringify(farm)) as Farm;
  }

  public async deleteFarm(id: string): Promise<void> {
    await this.init();
    await this.delay();
    this.farms = this.farms.filter((f) => f.id !== id);
    // Also remove associated plantations and activities
    this.plantations = this.plantations.filter((p) => p.farmId !== id);
    this.activities = this.activities.filter((a) => a.farmId !== id);
    await this.persist();
  }

  public async getPlantations(): Promise<Plantation[]> {
    await this.init();
    await this.delay();
    return JSON.parse(JSON.stringify(this.plantations)) as Plantation[];
  }

  public async getPlantationById(id: string): Promise<Plantation | null> {
    await this.init();
    await this.delay();
    const plt = this.plantations.find((p) => p.id === id);
    return plt ? (JSON.parse(JSON.stringify(plt)) as Plantation) : null;
  }

  public async createPlantation(plantation: Plantation): Promise<Plantation> {
    await this.init();
    await this.delay();
    // Validate farm exists
    const farmExists = this.farms.some((f) => f.id === plantation.farmId);
    if (!farmExists) {
      throw new Error(`A fazenda com ID ${plantation.farmId} não existe.`);
    }
    this.plantations.unshift(plantation);
    await this.persist();
    return JSON.parse(JSON.stringify(plantation)) as Plantation;
  }

  public async updatePlantation(plantation: Plantation): Promise<Plantation> {
    await this.init();
    await this.delay();
    const idx = this.plantations.findIndex((p) => p.id === plantation.id);
    if (idx === -1) throw new Error(`Talhão com ID ${plantation.id} não encontrado.`);
    this.plantations[idx] = plantation;
    await this.persist();
    return JSON.parse(JSON.stringify(plantation)) as Plantation;
  }

  public async deletePlantation(id: string): Promise<void> {
    await this.init();
    await this.delay();
    this.plantations = this.plantations.filter((p) => p.id !== id);
    // Remove or dissociate activities
    this.activities = this.activities.filter((a) => a.plantationId !== id);
    await this.persist();
  }

  public async getActivities(): Promise<FarmActivity[]> {
    await this.init();
    await this.delay();
    return JSON.parse(JSON.stringify(this.activities)) as FarmActivity[];
  }

  public async getActivityById(id: string): Promise<FarmActivity | null> {
    await this.init();
    await this.delay();
    const act = this.activities.find((a) => a.id === id);
    return act ? (JSON.parse(JSON.stringify(act)) as FarmActivity) : null;
  }

  public async createActivity(activity: FarmActivity): Promise<FarmActivity> {
    await this.init();
    await this.delay();
    const farmExists = this.farms.some((f) => f.id === activity.farmId);
    if (!farmExists) {
      throw new Error(`A fazenda com ID ${activity.farmId} não existe.`);
    }
    this.activities.unshift(activity);
    await this.persist();
    return JSON.parse(JSON.stringify(activity)) as FarmActivity;
  }

  public async updateActivity(activity: FarmActivity): Promise<FarmActivity> {
    await this.init();
    await this.delay();
    const idx = this.activities.findIndex((a) => a.id === activity.id);
    if (idx === -1) throw new Error(`Atividade com ID ${activity.id} não encontrada.`);
    this.activities[idx] = activity;
    await this.persist();
    return JSON.parse(JSON.stringify(activity)) as FarmActivity;
  }

  public async deleteActivity(id: string): Promise<void> {
    await this.init();
    await this.delay();
    this.activities = this.activities.filter((a) => a.id !== id);
    await this.persist();
  }

  public async resetToDefaults(): Promise<void> {
    this.farms = [...seedFarms];
    this.plantations = [...seedPlantations];
    this.activities = [...seedActivities];
    await this.persist();
  }
}

export const mockDb = new MockDatabase();
