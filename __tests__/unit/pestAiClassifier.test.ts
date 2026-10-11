import {
  PEST_CATALOG,
  classifyPestImageAsync,
} from '../../src/features/scouting/services/pestAiClassifier.service';

describe('Offline AI Pest Classifier Service', () => {
  test('PEST_CATALOG contains essential crops with valid diagnostic properties', () => {
    expect(PEST_CATALOG.length).toBeGreaterThanOrEqual(5);

    PEST_CATALOG.forEach((item) => {
      expect(item.pestId).toBeDefined();
      expect(item.commonName.length).toBeGreaterThan(0);
      expect(item.scientificName.length).toBeGreaterThan(0);
      expect(['low', 'medium', 'high', 'critical']).toContain(item.severity);
      expect(item.confidencePercent).toBeGreaterThanOrEqual(70);
      expect(item.confidencePercent).toBeLessThanOrEqual(100);
      expect(item.symptoms.length).toBeGreaterThan(0);
      expect(item.activeIngredientRecommendation.length).toBeGreaterThan(0);
      expect(item.urgencyHours).toBeGreaterThan(0);
    });
  });

  test('classifyPestImageAsync resolves appropriate match based on hints', async () => {
    const milhoResult = await classifyPestImageAsync('file:///photos/cartucho_milho.jpg');
    expect(milhoResult.commonName).toBe('Lagarta-do-Cartucho');
    expect(milhoResult.cropType).toBe('Milho');

    const percevejoResult = await classifyPestImageAsync('file:///photos/percevejo_dano.jpg');
    expect(percevejoResult.commonName).toBe('Percevejo-Marrom');

    const defaultResult = await classifyPestImageAsync(undefined, 'Soja');
    expect(defaultResult.cropType).toBe('Soja');
  });
});
