import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmAlert } from '../types';
import { triggerHaptic } from '../../../utils/haptics';

const STORAGE_KEY = '@farmflow_alerts_v1';

const INITIAL_ALERTS: FarmAlert[] = [
  {
    id: 'alt-1',
    title: 'Risco de Geada nas Próximas 36h',
    message: 'Massa de ar polar projetada para atingir a região. Risco severo para cafeeiros jovens e hortaliças.',
    severity: 'CRITICAL',
    category: 'WEATHER_RISK',
    farmId: 'farm-1',
    isRead: false,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    actionRoute: 'WeatherScreen',
  },
  {
    id: 'alt-2',
    title: 'Déficit Hídrico no Talhão 02 (Milho)',
    message: 'Umidade do solo atingiu nível crítico de 38%. Acione a lâmina de irrigação matinal.',
    severity: 'WARNING',
    category: 'SOIL_MOISTURE',
    farmId: 'farm-1',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    actionRoute: 'Plantations',
  },
  {
    id: 'alt-3',
    title: 'Janela Perfeita de Pulverização Aberta',
    message: 'Vento a 7 km/h e umidade relativa de 74%. Condições ideais para aplicação foliar sem deriva até 11:30.',
    severity: 'INFO',
    category: 'WEATHER_RISK',
    farmId: 'farm-1',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    actionRoute: 'Activities',
  },
  {
    id: 'alt-4',
    title: 'Carência de Fungicida Vencendo',
    message: 'Talhão de Soja 01: Período de segurança encerra em 48h. Liberação técnica para início de colheita.',
    severity: 'WARNING',
    category: 'CHEMICAL_EXPIRATION',
    farmId: 'farm-1',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    actionRoute: 'Plantations',
  },
];

export function useAlerts() {
  const [alerts, setAlerts] = useState<FarmAlert[]>(INITIAL_ALERTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAlerts(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
        }
      } catch {
        // Fall back to memory state
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveAlerts = async (newAlerts: FarmAlert[]) => {
    setAlerts(newAlerts);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
    } catch {
      // Ignore
    }
  };

  const markAsRead = async (alertId: string) => {
    await triggerHaptic('light');
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
    await saveAlerts(updated);
  };

  const markAllAsRead = async () => {
    await triggerHaptic('medium');
    const updated = alerts.map((a) => ({ ...a, isRead: true }));
    await saveAlerts(updated);
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return {
    alerts,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
