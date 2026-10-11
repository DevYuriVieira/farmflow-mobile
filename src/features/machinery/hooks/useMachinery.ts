import { useState, useCallback } from 'react';
import { AgriculturalMachine, MachineCategory } from '../types';
import { triggerHaptic } from '../../../utils/haptics';

const INITIAL_MACHINES: AgriculturalMachine[] = [
  {
    id: 'mach-1',
    name: 'John Deere 8R 370',
    code: 'TRAT-01',
    category: 'TRACTOR',
    modelYear: 2023,
    hoursWorked: 1420.5,
    status: 'OPERATING',
    fuelLevelPercent: 82,
    fuelConsumptionLPerHour: 26.4,
    currentSpeedKmH: 7.2,
    engineRpm: 1850,
    oilPressureBar: 4.5,
    coolantTempC: 86,
    operator: 'Rogério Batista',
    currentField: 'Talhão 01 — Soja Sul',
    nextMaintenanceInHours: 79.5,
    lastMaintenanceDate: '2026-08-15',
  },
  {
    id: 'mach-2',
    name: 'Jacto Uniport 3030',
    code: 'PULV-01',
    category: 'SPRAYER',
    modelYear: 2024,
    hoursWorked: 680.0,
    status: 'OPERATING',
    fuelLevelPercent: 64,
    fuelConsumptionLPerHour: 18.2,
    currentSpeedKmH: 14.5,
    engineRpm: 2100,
    oilPressureBar: 4.8,
    coolantTempC: 89,
    operator: 'Carlos Mendes',
    currentField: 'Talhão 03 — Milho',
    nextMaintenanceInHours: 20.0,
    lastMaintenanceDate: '2026-09-02',
  },
  {
    id: 'mach-3',
    name: 'Case IH Axial-Flow 8250',
    code: 'COLH-01',
    category: 'HARVESTER',
    modelYear: 2022,
    hoursWorked: 2310.8,
    status: 'IDLE',
    fuelLevelPercent: 45,
    fuelConsumptionLPerHour: 0.0,
    currentSpeedKmH: 0.0,
    engineRpm: 800,
    oilPressureBar: 3.2,
    coolantTempC: 72,
    operator: 'Aguardando Escala',
    currentField: 'Galpão Principal',
    nextMaintenanceInHours: 189.2,
    lastMaintenanceDate: '2026-07-20',
  },
  {
    id: 'mach-4',
    name: 'Stara Estrela 32 Linhas',
    code: 'PLAN-01',
    category: 'PLANTER',
    modelYear: 2023,
    hoursWorked: 890.4,
    status: 'IDLE',
    fuelLevelPercent: 95,
    fuelConsumptionLPerHour: 0.0,
    currentSpeedKmH: 0.0,
    engineRpm: 0,
    oilPressureBar: 0.0,
    coolantTempC: 25,
    operator: 'Acoplada no Pátio',
    currentField: 'Oficina Central',
    nextMaintenanceInHours: 109.6,
    lastMaintenanceDate: '2026-08-30',
  },
];

export const useMachinery = () => {
  const [machines, setMachines] = useState<AgriculturalMachine[]>(INITIAL_MACHINES);
  const [filterCategory, setFilterCategory] = useState<MachineCategory | 'ALL'>('ALL');

  const toggleMachineOperation = useCallback((id: string) => {
    void triggerHaptic('medium');
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.status === 'OPERATING' ? 'IDLE' : 'OPERATING';
        return {
          ...m,
          status: newStatus,
          currentSpeedKmH: newStatus === 'OPERATING' ? 6.5 : 0,
          fuelConsumptionLPerHour: newStatus === 'OPERATING' ? 22.0 : 0,
          engineRpm: newStatus === 'OPERATING' ? 1800 : 750,
        };
      })
    );
  }, []);

  const filteredMachines = machines.filter(
    (m) => filterCategory === 'ALL' || m.category === filterCategory
  );

  const operatingCount = machines.filter((m) => m.status === 'OPERATING').length;
  const maintenanceAlertCount = machines.filter((m) => m.nextMaintenanceInHours <= 50).length;
  const totalFleetHours = machines.reduce((acc, m) => acc + m.hoursWorked, 0);

  return {
    machines: filteredMachines,
    allMachines: machines,
    filterCategory,
    setFilterCategory,
    toggleMachineOperation,
    operatingCount,
    maintenanceAlertCount,
    totalFleetHours,
  };
};
