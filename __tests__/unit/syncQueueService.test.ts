const storageMock: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(storageMock[key] || null)),
  setItem: jest.fn((key: string, val: string) => {
    storageMock[key] = val;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete storageMock[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storageMock).forEach((k) => delete storageMock[k]);
    return Promise.resolve();
  }),
}));

import {
  getOfflineQueue,
  enqueueOfflineMutation,
  dequeueOfflineMutation,
  clearOfflineQueue,
  seedSimulatedOfflineBatch,
  processQueueDrain,
} from '../../src/services/syncQueue.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Offline Sync Queue Service', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(async () => {
    await clearOfflineQueue();
  });

  it('enqueues a new offline mutation with generated UUID and pending status', async () => {
    const item = await enqueueOfflineMutation({
      type: 'SPRAY_APPLICATION',
      entityName: 'Talhão 02 - Milho',
      payload: { dose: '0.4 L/ha', nozzle: 'AIXR' },
    });

    expect(item.id).toBeDefined();
    expect(item.status).toBe('PENDING');
    expect(item.attempts).toBe(0);

    const queue = await getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].entityName).toBe('Talhão 02 - Milho');
  });

  it('removes a processed mutation from the queue via dequeueOfflineMutation', async () => {
    const item1 = await enqueueOfflineMutation({
      type: 'MACHINERY_UPDATE',
      entityName: 'Trator 01',
      payload: { hours: 120 },
    });
    const item2 = await enqueueOfflineMutation({
      type: 'PEST_FINDING',
      entityName: 'Lagarta',
      payload: { severity: 'HIGH' },
    });

    let queue = await getOfflineQueue();
    expect(queue.length).toBe(2);

    await dequeueOfflineMutation(item1.id);
    queue = await getOfflineQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].id).toBe(item2.id);
  });

  it('seeds simulated offline batches for field demo testing', async () => {
    const seeded = await seedSimulatedOfflineBatch(3);
    expect(seeded.length).toBe(3);

    const queue = await getOfflineQueue();
    expect(queue.length).toBe(3);
    expect(queue[0].type).toBeDefined();
  });

  it('clears all pending items from offline storage', async () => {
    await seedSimulatedOfflineBatch(2);
    let queue = await getOfflineQueue();
    expect(queue.length).toBe(2);

    await clearOfflineQueue();
    queue = await getOfflineQueue();
    expect(queue.length).toBe(0);
  });

  it('drains the queue and increments attempt counters or resolves items', async () => {
    await enqueueOfflineMutation({
      type: 'TEST_MUTATION',
      entityName: 'Sensor Pivô 01',
      payload: { pressure: 3.1 },
    });

    const result = await processQueueDrain();
    expect(result.success + result.failed).toBe(1);
  });
});
