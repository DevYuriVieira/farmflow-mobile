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

    // Total cost per ha: 400 + 1500 + 800 + 600 + 400 = 3700
    expect(finances.costPerHectare).toBe(3700);
    // Total investment: 3700 * 100 = 370,000
    expect(finances.totalInvestment).toBe(370000);
    // Gross revenue per ha: 70 * 140 = 9800
    expect(finances.grossRevenuePerHectare).toBe(9800);
    // Net profit per ha: 9800 - 3700 = 6100
    expect(finances.netProfitPerHectare).toBe(6100);
    // Total profit: 6100 * 100 = 610,000
    expect(finances.totalNetProfit).toBe(610000);
    // Break-even: 3700 / 140 = 26.4 bags/ha
    expect(finances.breakEvenBagsPerHa).toBe(26.4);
    // ROI: (6100 / 3700) * 100 = 164.9%
    expect(finances.roiPercent).toBe(164.9);
  });
});
