export type MachineCategory = 'TRACTOR' | 'HARVESTER' | 'SPRAYER' | 'PLANTER';
export type MachineOperationalStatus = 'OPERATING' | 'IDLE' | 'MAINTENANCE';

export interface AgriculturalMachine {
  id: string;
  name: string;
  code: string; // Ex: TRAT-01, PULV-01
  category: MachineCategory;
  modelYear: number;
  hoursWorked: number; // Horímetro total
  status: MachineOperationalStatus;
  fuelLevelPercent: number; // 0 a 100%
  fuelConsumptionLPerHour: number; // L/h
  currentSpeedKmH: number; // km/h
  engineRpm: number;
  oilPressureBar: number;
  coolantTempC: number;
  operator: string;
  currentField: string;
  nextMaintenanceInHours: number; // Horas restantes para próxima revisão
  lastMaintenanceDate: string;
}
