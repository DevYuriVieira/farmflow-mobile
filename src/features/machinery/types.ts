export type MachineCategory = 'TRACTOR' | 'HARVESTER' | 'SPRAYER' | 'PLANTER';
export type MachineOperationalStatus = 'OPERATING' | 'IDLE' | 'MAINTENANCE';

export interface AgriculturalMachine {
  id: string;
  name: string;
  code: string;
  category: MachineCategory;
  modelYear: number;
  hoursWorked: number;
  status: MachineOperationalStatus;
  fuelLevelPercent: number;
  fuelConsumptionLPerHour: number;
  currentSpeedKmH: number;
  engineRpm: number;
  oilPressureBar: number;
  coolantTempC: number;
  operator: string;
  currentField: string;
  nextMaintenanceInHours: number;
  lastMaintenanceDate: string;
}
