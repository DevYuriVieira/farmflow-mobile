import { ENV } from '../config/env';
import { IAuthRepository } from './auth.repository';
import { IFarmRepository } from './farm.repository';
import { IPlantationRepository } from './plantation.repository';
import { IActivityRepository } from './activity.repository';

import { MockAuthRepository } from '../mocks/mockAuth.repository';
import { MockFarmRepository } from '../mocks/mockFarm.repository';
import { MockPlantationRepository } from '../mocks/mockPlantation.repository';
import { MockActivityRepository } from '../mocks/mockActivity.repository';

import { HttpAuthRepository } from './http/httpAuth.repository';
import { HttpFarmRepository } from './http/httpFarm.repository';
import { HttpPlantationRepository } from './http/httpPlantation.repository';
import { HttpActivityRepository } from './http/httpActivity.repository';

class RepositoryContainer {
  public readonly auth: IAuthRepository;
  public readonly farm: IFarmRepository;
  public readonly plantation: IPlantationRepository;
  public readonly activity: IActivityRepository;

  constructor() {
    if (ENV.useMockApi) {
      this.auth = new MockAuthRepository();
      this.farm = new MockFarmRepository();
      this.plantation = new MockPlantationRepository();
      this.activity = new MockActivityRepository();
    } else {
      this.auth = new HttpAuthRepository();
      this.farm = new HttpFarmRepository();
      this.plantation = new HttpPlantationRepository();
      this.activity = new HttpActivityRepository();
    }
  }
}

export const repositories = new RepositoryContainer();
export const authRepository = repositories.auth;
export const farmRepository = repositories.farm;
export const plantationRepository = repositories.plantation;
export const activityRepository = repositories.activity;

export * from './auth.repository';
export * from './farm.repository';
export * from './plantation.repository';
export * from './activity.repository';
