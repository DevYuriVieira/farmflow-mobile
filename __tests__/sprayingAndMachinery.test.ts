import {
  calculateDriftRisk,
  calculateTotalSprayVolumeLiters,
} from '../src/features/spraying/sprayFormulas';

describe('Agricultural Spraying & Drift Risk Calculations', () => {
  it('identifies LOW drift risk under optimal meteorological conditions', () => {
    const risk = calculateDriftRisk(5, 65, 24);
    expect(risk).toBe('LOW');
  });

  it('detects HIGH drift risk when wind speed exceeds safety limits (>10 km/h)', () => {
    const risk = calculateDriftRisk(12, 60, 25);
    expect(risk).toBe('HIGH');
  });

  it('detects HIGH drift risk when relative humidity drops below 50%', () => {
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
    const totalVolume = calculateTotalSprayVolumeLiters(120, 45);
    expect(totalVolume).toBe(5400);
  });
});
