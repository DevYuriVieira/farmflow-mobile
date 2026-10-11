import { CropFinancesInput, CropFinancesResult } from './types';

export function calculateCropFinances(input: CropFinancesInput): CropFinancesResult {
  const {
    hectares,
    expectedYieldBagsPerHa,
    bagMarketPrice,
    seedsCostPerHa,
    fertilizersCostPerHa,
    chemicalsCostPerHa,
    fuelAndMachineryCostPerHa,
    laborAndOperationsCostPerHa,
  } = input;

  const validHa = Math.max(0.1, hectares);
  const validPrice = Math.max(1, bagMarketPrice);

  const costPerHectare =
    seedsCostPerHa +
    fertilizersCostPerHa +
    chemicalsCostPerHa +
    fuelAndMachineryCostPerHa +
    laborAndOperationsCostPerHa;

  const totalInvestment = costPerHectare * validHa;
  const grossRevenuePerHectare = expectedYieldBagsPerHa * validPrice;
  const totalGrossRevenue = grossRevenuePerHectare * validHa;

  const netProfitPerHectare = grossRevenuePerHectare - costPerHectare;
  const totalNetProfit = totalGrossRevenue - totalInvestment;

  const breakEvenBagsPerHa = Number((costPerHectare / validPrice).toFixed(1));
  const roiPercent = costPerHectare > 0
    ? Number(((netProfitPerHectare / costPerHectare) * 100).toFixed(1))
    : 0;

  return {
    costPerHectare: Math.round(costPerHectare),
    totalInvestment: Math.round(totalInvestment),
    grossRevenuePerHectare: Math.round(grossRevenuePerHectare),
    totalGrossRevenue: Math.round(totalGrossRevenue),
    netProfitPerHectare: Math.round(netProfitPerHectare),
    totalNetProfit: Math.round(totalNetProfit),
    breakEvenBagsPerHa,
    roiPercent,
  };
}
