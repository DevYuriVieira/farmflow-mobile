import {
  calculateDriftRisk,
  calculateTotalSprayVolumeLiters,
} from '../src/features/spraying/sprayFormulas';

describe('Agricultural Spraying & Drift Risk Calculations', () => {
  it('identifies LOW drift risk under optimal meteorological conditions', () => {
    // Vento calmo (5 km/h), umidade alta (65%), temperatura moderada (24°C)
    const risk = calculateDriftRisk(5, 65, 24);
    expect(risk).toBe('LOW');
  });

  it('detects HIGH drift risk when wind speed exceeds safety limits (>10 km/h)', () => {
    const risk = calculateDriftRisk(12, 60, 25);
    expect(risk).toBe('HIGH');
  });

  it('detects HIGH drift risk when relative humidity drops below 50%', () => {
    // Risco alto de evaporação rápida de gotas pequenas
    const risk = calculateDriftRisk(6, 42, 28);
    expect(risk).toBe('HIGH');
  });

  it('detects HIGH drift risk when ambient temperature exceeds 30°C', () => {
    const risk = calculateDriftRisk(6, 65, 32);
    expect(risk).toBe('HIGH');
  });

  it('detects MODERATE drift risk on marginal wind or humidity boundaries', () => {
    const risk = calculateDriftRisk(8, 52, 26);
    expect(risk).toBe('MODERATE');
  });

  it('calculates total tank spray volume correctly for treated field area', () => {
    // 120 L/ha aplicados em 45 hectares = 5400 Litros de calda
    const totalVolume = calculateTotalSprayVolumeLiters(120, 45);
    expect(totalVolume).toBe(5400);
  });
});
