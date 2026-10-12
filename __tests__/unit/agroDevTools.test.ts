jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

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

import { seedSimulatedOfflineBatch, getOfflineQueue, clearOfflineQueue } from '../../src/services/syncQueue.service';
import { triggerHaptic } from '../../src/utils/haptics';

describe('Agro DevTools & Simulator Testbench', () => {
  beforeEach(async () => {
    await clearOfflineQueue();
  });

  afterEach(async () => {
    await clearOfflineQueue();
  });

  it('injects concurrent mutation bursts into the queue without collision', async () => {
    await seedSimulatedOfflineBatch(10);
    const queue = await getOfflineQueue();
    expect(queue.length).toBe(10);

    const ids = new Set(queue.map((q) => q.id));
    expect(ids.size).toBe(10); // All 10 IDs must be strictly unique
  });

  it('executes triggerHaptic without throwing on any haptic style', async () => {
    await expect(triggerHaptic('light')).resolves.not.toThrow();
    await expect(triggerHaptic('medium')).resolves.not.toThrow();
    await expect(triggerHaptic('heavy')).resolves.not.toThrow();
    await expect(triggerHaptic('success')).resolves.not.toThrow();
    await expect(triggerHaptic('warning')).resolves.not.toThrow();
    await expect(triggerHaptic('error')).resolves.not.toThrow();
  });
});
