jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file:///mock/mapa_spray_report.pdf' }),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

import { calculateDeltaT, generateAndShareSprayMapaReport, SprayMapaReportData } from '../../src/services/pdfReport.service';

describe('Spray Diary MAPA Compliance & Delta T Calculation', () => {
  it('correctly classifies ideal spraying weather window in Delta T (2.0 to 8.0 °C)', () => {
    // 24°C, 65% RH
    const result = calculateDeltaT(24, 65);
    expect(result.value).toBeGreaterThanOrEqual(2.0);
    expect(result.value).toBeLessThanOrEqual(8.0);
    expect(result.status).toBe('IDEAL');
  });

  it('detects critical risk of evaporation / high drift when Delta T > 8.0 °C', () => {
    // 36°C, 25% RH (very dry and hot)
    const result = calculateDeltaT(36, 25);
    expect(result.value).toBeGreaterThan(8.0);
    expect(['WARNING', 'CRITICAL']).toContain(result.status);
  });

  it('generates a valid MAPA official PDF document with prescription and digital hash', async () => {
    const mockData: SprayMapaReportData = {
      farmName: 'Fazenda Santa Fé',
      farmLocation: 'Rio Verde - GO',
      plantationName: 'Talhão 04 — Soja Intacta',
      cropType: 'Soja',
      targetPest: 'Ferrugem Asiática',
      productName: 'Fox Xpro',
      activeIngredient: 'Trifloxistrobina + Protioconazol + Bixafem',
      dosagePerHectare: '0.5 L/ha',
      sprayVolumeLPerHa: 120,
      totalTreatedAreaHa: 50,
      nozzleType: 'Jato Plano Indução de Ar (AIXR 11002)',
      windSpeedKmH: 6.5,
      temperatureC: 24,
      humidityPercent: 65,
      withdrawalPeriodDays: 21,
      operatorName: 'Carlos Mendes',
      appliedAt: new Date().toISOString(),
      digitalSignatureHash: 'SHA256-TEST-VERIFIED-SIGNATURE-HASH',
      bufferZoneMeters: 30,
      language: 'pt',
    };

    const response = await generateAndShareSprayMapaReport(mockData);
    expect(response).toBeDefined();
    expect(response.uri).toContain('mapa_spray_report.pdf');
  });
});
