import { registerServiceWorker } from '../../src/utils/pwa';

describe('PWA & Web Offline Utilities', () => {
  test('registerServiceWorker executes safely without crashing in node or test environment', () => {
    expect(() => {
      registerServiceWorker();
    }).not.toThrow();
  });
});
