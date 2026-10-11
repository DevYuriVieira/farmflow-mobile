import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoutingRecord } from '../types';
import { triggerHaptic } from '../../../utils/haptics';

const STORAGE_KEY = '@farmflow_scouting_records_v1';

const INITIAL_RECORDS: ScoutingRecord[] = [
  {
    id: 'scout-1',
    farmId: 'farm-1',
    plantationId: 'pl-1',
    plantationName: 'Talhão 01 — Soja Sul',
    pestId: 'pest-1',
    pestName: 'Ferrugem Asiática',
    severity: 'MEDIUM',
    affectedPlantsPercent: 8,
    locationNote: 'Borda leste próxima à mata ciliar',
    imageUri: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80',
    aiConfidencePercent: 96.4,
    aiDiagnosisLabel: 'Ferrugem Asiática (Phakopsora pachyrhizi)',
    notes: 'Primeiras pústulas observadas em folhas baixeiras. Diagnóstico confirmado via IA. Recomendado entrar com fungicida preventivo.',
    actionTaken: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scout-2',
    farmId: 'farm-1',
    plantationId: 'pl-2',
    plantationName: 'Talhão 02 — Milho Safrinha',
    pestId: 'pest-2',
    pestName: 'Lagarta-do-Cartucho',
    severity: 'CRITICAL',
    affectedPlantsPercent: 24,
    locationNote: 'Ponto central do pivô 02',
    notes: 'Roeduras ativas no cartucho superando nível de dano econômico (20%). Aplicação de diamida agendada.',
    actionTaken: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'scout-3',
    farmId: 'farm-1',
    plantationId: 'pl-1',
    plantationName: 'Talhão 01 — Soja Sul',
    pestId: 'pest-3',
    pestName: 'Percevejo-Marrom da Soja',
    severity: 'LOW',
    affectedPlantsPercent: 3,
    locationNote: 'Linhas 40 a 60',
    notes: 'População abaixo do nível de controle (0.5 percevejo/metro). Manter monitoramento semanal.',
    actionTaken: true,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export function useScouting() {
  const [records, setRecords] = useState<ScoutingRecord[]>(INITIAL_RECORDS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecords(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveRecords = async (newRecords: ScoutingRecord[]) => {
    setRecords(newRecords);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    } catch {
    }
  };

  const addRecord = async (
    record: Omit<ScoutingRecord, 'id' | 'createdAt' | 'actionTaken'>
  ) => {
    await triggerHaptic('success');
    const newRecord: ScoutingRecord = {
      ...record,
      id: `scout-${Date.now()}`,
      actionTaken: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...records];
    await saveRecords(updated);
    return newRecord;
  };

  const toggleActionTaken = async (recordId: string) => {
    await triggerHaptic('light');
    const updated = records.map((r) =>
      r.id === recordId ? { ...r, actionTaken: !r.actionTaken } : r
    );
    await saveRecords(updated);
  };

  const deleteRecord = async (recordId: string) => {
    await triggerHaptic('warning');
    const updated = records.filter((r) => r.id !== recordId);
    await saveRecords(updated);
  };

  return {
    records,
    isLoading,
    addRecord,
    toggleActionTaken,
    deleteRecord,
  };
}
