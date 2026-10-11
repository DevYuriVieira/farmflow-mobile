import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SprayApplication } from '../types';
import { triggerHaptic } from '../../../utils/haptics';
import { calculateDriftRisk } from '../sprayFormulas';

export { calculateDriftRisk };

const STORAGE_KEY = '@farmflow:spray_diary';

const INITIAL_MOCK_APPLICATIONS: SprayApplication[] = [
  {
    id: 'spray-1',
    farmId: 'farm-1',
    plantationName: 'Talhão 01 — Soja Sul',
    targetPest: 'Ferrugem Asiática (Phakopsora pachyrhizi)',
    productName: 'Fox Xpro + Áureo',
    activeIngredient: 'Trifloxistrobina + Protioconazol + Bixafen',
    dosePerHectare: '0.5 L/ha',
    sprayVolumeLPerHa: 120,
    totalTreatedAreaHa: 45,
    nozzleType: 'Jato Plano c/ Indução de Ar (AIXR 11002)',
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    withdrawalPeriodDays: 14,
    harvestSafeDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    temperatureC: 23,
    humidityPercent: 68,
    windSpeedKmH: 5.5,
    driftRisk: 'LOW',
    operatorName: 'Carlos Mendes (Pulv. Uniport 3030)',
    status: 'IN_GRACE_PERIOD',
    notes: 'Aplicação foliar preventiva no estádio R3. Cobertura homogênea de terço médio.',
  },
  {
    id: 'spray-2',
    farmId: 'farm-1',
    plantationName: 'Talhão 03 — Milho Safrinha',
    targetPest: 'Lagarta-do-Cartucho (Spodoptera frugiperda)',
    productName: 'Premio 200 SC',
    activeIngredient: 'Clorantraniliprole',
    dosePerHectare: '100 mL/ha',
    sprayVolumeLPerHa: 150,
    totalTreatedAreaHa: 28,
    nozzleType: 'Cone Vazio Alta Precisão (TXR 8002)',
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    withdrawalPeriodDays: 7,
    harvestSafeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    temperatureC: 25,
    humidityPercent: 62,
    windSpeedKmH: 6.8,
    driftRisk: 'LOW',
    operatorName: 'Rodrigo Antunes (Trator John Deere 6135M)',
    status: 'SAFE_TO_HARVEST',
    notes: 'Ponta de alta penetração em cartucho. Controle biológico de 95%.',
  },
  {
    id: 'spray-3',
    farmId: 'farm-1',
    plantationName: 'Horta & Olericultura 04',
    targetPest: 'Oídio e Mofo Cinzento',
    productName: 'Serenade Biofungicida',
    activeIngredient: 'Bacillus subtilis linhagem QST 713',
    dosePerHectare: '2.0 L/ha',
    sprayVolumeLPerHa: 200,
    totalTreatedAreaHa: 4.5,
    nozzleType: 'Jato Cônico Duplo (D3)',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    withdrawalPeriodDays: 0,
    harvestSafeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    temperatureC: 22,
    humidityPercent: 74,
    windSpeedKmH: 4.0,
    driftRisk: 'LOW',
    operatorName: 'Marcos Vieira',
    status: 'SAFE_TO_HARVEST',
    notes: 'Biológico com carência zero de resíduos químicos. Seguro para consumo imediato.',
  },
];

export const useSpraying = () => {
  const [applications, setApplications] = useState<SprayApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApplications(JSON.parse(stored));
      } else {
        setApplications(INITIAL_MOCK_APPLICATIONS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_APPLICATIONS));
      }
    } catch {
      setApplications(INITIAL_MOCK_APPLICATIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const addApplication = async (newApp: Omit<SprayApplication, 'id' | 'status' | 'harvestSafeDate'>) => {
    void triggerHaptic('medium');
    const appliedTime = new Date(newApp.appliedAt).getTime();
    const safeTime = appliedTime + newApp.withdrawalPeriodDays * 24 * 60 * 60 * 1000;
    const isSafe = Date.now() >= safeTime;

    const fullApp: SprayApplication = {
      ...newApp,
      id: `spray-${Date.now()}`,
      harvestSafeDate: new Date(safeTime).toISOString(),
      status: isSafe ? 'SAFE_TO_HARVEST' : 'IN_GRACE_PERIOD',
    };

    const updated = [fullApp, ...applications];
    setApplications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return fullApp;
  };

  const deleteApplication = async (id: string) => {
    void triggerHaptic('light');
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const inGraceCount = applications.filter((a) => a.status === 'IN_GRACE_PERIOD').length;
  const safeCount = applications.filter((a) => a.status === 'SAFE_TO_HARVEST').length;

  return {
    applications,
    isLoading,
    inGraceCount,
    safeCount,
    addApplication,
    deleteApplication,
    refresh: loadApplications,
  };
};
