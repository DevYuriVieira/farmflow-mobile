import { calculateCropFinances } from '../src/features/finances/cropFinanceFormulas';

describe('Crop Finance Formulas', () => {
  test('calculates cost per hectare, total investment, net profit and break-even', () => {
    const finances = calculateCropFinances({
      crop: 'SOY',
      hectares: 100,
      expectedYieldBagsPerHa: 70,
      bagMarketPrice: 140,
      seedsCostPerHa: 400,
      fertilizersCostPerHa: 1500,
      chemicalsCostPerHa: 800,
      fuelAndMachineryCostPerHa: 600,
      laborAndOperationsCostPerHa: 400,
    });

    expect(finances.costPerHectare).toBe(3700);
    expect(finances.totalInvestment).toBe(370000);
    expect(finances.grossRevenuePerHectare).toBe(9800);
    expect(finances.netProfitPerHectare).toBe(6100);
    expect(finances.totalNetProfit).toBe(610000);
    expect(finances.breakEvenBagsPerHa).toBe(26.4);
    expect(finances.roiPercent).toBe(164.9);
  });
});
