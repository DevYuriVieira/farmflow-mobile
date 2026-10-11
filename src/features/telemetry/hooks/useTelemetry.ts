import { useState } from 'react';
import { IrrigationPivot, GrainSilo } from '../types';
import { triggerHaptic } from '../../../utils/haptics';

const INITIAL_PIVOTS: IrrigationPivot[] = [
  {
    id: 'piv-1',
    name: 'Pivô Central 01 — Vale das Águas',
    farmId: 'farm-1',
    isRunning: true,
    speedPercent: 65,
    waterDepthMm: 8.5,
    pressureBar: 3.4,
    flowRateM3H: 145,
    angleDegrees: 184,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'piv-2',
    name: 'Pivô Central 02 — Platô Norte',
    farmId: 'farm-1',
    isRunning: false,
    speedPercent: 0,
    waterDepthMm: 0,
    pressureBar: 0.2,
    flowRateM3H: 0,
    angleDegrees: 45,
    lastUpdated: new Date().toISOString(),
  },
];

const INITIAL_SILOS: GrainSilo[] = [
  {
    id: 'silo-1',
    name: 'Silo Pulmão 01 — Soja',
    grainType: 'SOJA',
    capacityTons: 3000,
    currentTons: 2340,
    temperatureCelsius: 18.2,
    moisturePercent: 12.8,
    aerationActive: true,
    status: 'OPTIMAL',
  },
  {
    id: 'silo-2',
    name: 'Silo Secador 02 — Milho',
    grainType: 'MILHO',
    capacityTons: 2500,
    currentTons: 1125,
    temperatureCelsius: 19.5,
    moisturePercent: 13.4,
    aerationActive: false,
    status: 'OPTIMAL',
  },
];

export function useTelemetry() {
  const [pivots, setPivots] = useState<IrrigationPivot[]>(INITIAL_PIVOTS);
  const [silos, setSilos] = useState<GrainSilo[]>(INITIAL_SILOS);

  const togglePivot = async (pivotId: string) => {
    await triggerHaptic('medium');
    setPivots((prev) =>
      prev.map((p) => {
        if (p.id !== pivotId) return p;
        const nextState = !p.isRunning;
        return {
          ...p,
          isRunning: nextState,
          speedPercent: nextState ? 60 : 0,
          waterDepthMm: nextState ? 8.0 : 0,
          pressureBar: nextState ? 3.3 : 0.2,
          flowRateM3H: nextState ? 140 : 0,
          lastUpdated: new Date().toISOString(),
        };
      })
    );
  };

  const toggleAeration = async (siloId: string) => {
    await triggerHaptic('light');
    setSilos((prev) =>
      prev.map((s) => (s.id === siloId ? { ...s, aerationActive: !s.aerationActive } : s))
    );
  };

  return {
    pivots,
    silos,
    togglePivot,
    toggleAeration,
  };
}
