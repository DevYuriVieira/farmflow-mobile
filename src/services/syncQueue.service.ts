import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineQueueItem {
  id: string;
  type: string;
  entityName: string;
  payload: Record<string, unknown>;
  queuedAt: string;
  attempts: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'RESOLVED';
  lastError?: string;
}

const QUEUE_STORAGE_KEY = '@farmflow_offline_queue_items';

export async function getOfflineQueue(): Promise<OfflineQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineQueueItem[];
  } catch {
    return [];
  }
}

export async function saveOfflineQueue(queue: OfflineQueueItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Fail silently in memory
  }
}

export async function enqueueOfflineMutation(
  item: Omit<OfflineQueueItem, 'id' | 'queuedAt' | 'attempts' | 'status'>
): Promise<OfflineQueueItem> {
  const currentQueue = await getOfflineQueue();
  const newItem: OfflineQueueItem = {
    ...item,
    id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    queuedAt: new Date().toISOString(),
    attempts: 0,
    status: 'PENDING',
  };

  currentQueue.push(newItem);
  await saveOfflineQueue(currentQueue);
  return newItem;
}

export async function dequeueOfflineMutation(id: string): Promise<void> {
  const currentQueue = await getOfflineQueue();
  const filtered = currentQueue.filter((item) => item.id !== id);
  await saveOfflineQueue(filtered);
}

export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
}

export async function seedSimulatedOfflineBatch(count: number = 3): Promise<OfflineQueueItem[]> {
  const sampleMutations = [
    {
      type: 'SPRAY_APPLICATION',
      entityName: 'Talhão 04 — Soja Intacta (Fox Xpro)',
      payload: { dose: '0.5 L/ha', wind: 6, deltaT: 4.2 },
    },
    {
      type: 'MACHINERY_HOURMETER',
      entityName: 'Trator John Deere 8400R (+4.5h)',
      payload: { hourMeter: 1245.5, operator: 'Carlos Mendes' },
    },
    {
      type: 'PEST_SCOUTING',
      entityName: 'Monitoramento: Lagarta Falsa-Medideira',
      payload: { severity: 'MODERATE', sampledPlants: 20, infested: 3 },
    },
    {
      type: 'IRRIGATION_TELEMETRY',
      entityName: 'Pivô Central 02 (Lâmina 12mm)',
      payload: { angle: 184, pressureBar: 3.2, waterMm: 12 },
    },
    {
      type: 'SILO_TEMPERATURE',
      entityName: 'Silo Graneleiro 01 (Termometria 24.5°C)',
      payload: { moisturePercent: 13.8, tempMax: 26.1 },
    },
  ];

  const currentQueue = await getOfflineQueue();

  for (let i = 0; i < count; i++) {
    const sample = sampleMutations[i % sampleMutations.length];
    const item: OfflineQueueItem = {
      id: `sim-${Date.now()}-${i}`,
      type: sample.type,
      entityName: sample.entityName,
      payload: sample.payload,
      queuedAt: new Date(Date.now() - (i + 1) * 120000).toISOString(),
      attempts: 0,
      status: 'PENDING',
    };
    currentQueue.push(item);
  }

  await saveOfflineQueue(currentQueue);
  return currentQueue;
}

export async function processQueueDrain(
  onProgress?: (processed: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return { success: 0, failed: 0 };

  let successCount = 0;
  let failedCount = 0;
  const remainingQueue: OfflineQueueItem[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    item.status = 'SYNCING';
    item.attempts += 1;

    // Simulate reliable network round-trip per mutation
    await new Promise((res) => setTimeout(res, 280));

    // 95% success probability simulation
    const isSuccessful = Math.random() > 0.05;

    if (isSuccessful) {
      item.status = 'RESOLVED';
      successCount++;
    } else {
      item.status = 'FAILED';
      item.lastError = 'Gateway timeout (504) — retry scheduled';
      failedCount++;
      remainingQueue.push(item);
    }

    if (onProgress) {
      onProgress(i + 1, queue.length);
    }
  }

  await saveOfflineQueue(remainingQueue);
  return { success: successCount, failed: failedCount };
}
