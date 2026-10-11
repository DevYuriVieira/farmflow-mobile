import {
  checkBiometricSupport,
  authenticateWithBiometrics,
  storeSecureToken,
  getSecureToken,
  removeSecureToken,
} from '../../src/services/security/biometrics.service';

describe('Biometrics & Secure Token Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('checkBiometricSupport returns safe fallback when native module not enrolled in test environment', async () => {
    const status = await checkBiometricSupport();
    expect(status).toHaveProperty('hasHardware');
    expect(status).toHaveProperty('isEnrolled');
    expect(status).toHaveProperty('supportedTypes');
    expect(Array.isArray(status.supportedTypes)).toBe(true);
  });

  test('authenticateWithBiometrics returns handled response in test environment without throwing', async () => {
    const result = await authenticateWithBiometrics('Test Prompt');
    expect(result).toHaveProperty('success');
  });

  test('storeSecureToken, getSecureToken and removeSecureToken execute without crashing', async () => {
    const stored = await storeSecureToken('test_key', 'test_secret_jwt');
    expect(typeof stored).toBe('boolean');

    const retrieved = await getSecureToken('test_key');
    expect(retrieved === null || typeof retrieved === 'string').toBe(true);

    const removed = await removeSecureToken('test_key');
    expect(typeof removed).toBe('boolean');
  });
});
