export interface CropFinancesInput {
  crop: 'SOY' | 'CORN' | 'COFFEE';
  hectares: number;
  expectedYieldBagsPerHa: number;
  bagMarketPrice: number; // Ex: R$ 138,00 / saca de soja
  // Custos por hectare (R$/ha)
  seedsCostPerHa: number;
  fertilizersCostPerHa: number;
  chemicalsCostPerHa: number;
  fuelAndMachineryCostPerHa: number;
  laborAndOperationsCostPerHa: number;
}

export interface CropFinancesResult {
  costPerHectare: number;
  totalInvestment: number;
  grossRevenuePerHectare: number;
  totalGrossRevenue: number;
  netProfitPerHectare: number;
  totalNetProfit: number;
  breakEvenBagsPerHa: number;
  roiPercent: number;
}
