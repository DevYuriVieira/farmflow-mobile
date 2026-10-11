import { MarketSummary, CommodityQuote } from '../types';

export const INITIAL_QUOTES: CommodityQuote[] = [
  {
    id: 'comm-soy',
    name: 'Soja em Grão',
    unit: 'sc 60kg',
    marketReference: 'Paranaguá (Cepea)',
    priceBrl: 138.5,
    dailyChangePercent: 1.25,
    highBrl: 139.2,
    lowBrl: 136.8,
    weeklyTrend: [134.5, 135.2, 136.0, 135.8, 137.1, 137.9, 138.5],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comm-corn',
    name: 'Milho Amarelo',
    unit: 'sc 60kg',
    marketReference: 'Campinas (B3)',
    priceBrl: 62.8,
    dailyChangePercent: -0.42,
    highBrl: 63.5,
    lowBrl: 62.1,
    weeklyTrend: [64.0, 63.8, 63.2, 63.5, 62.9, 63.1, 62.8],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comm-coffee',
    name: 'Café Arábica Tipo 6',
    unit: 'sc 60kg',
    marketReference: 'Santos (Cepea)',
    priceBrl: 1285.0,
    dailyChangePercent: 2.14,
    highBrl: 1295.0,
    lowBrl: 1250.0,
    weeklyTrend: [1210, 1225, 1240, 1235, 1260, 1272, 1285],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comm-cattle',
    name: 'Boi Gordo',
    unit: '@ 15kg',
    marketReference: 'São Paulo (B3)',
    priceBrl: 254.0,
    dailyChangePercent: 0.8,
    highBrl: 256.0,
    lowBrl: 251.5,
    weeklyTrend: [248, 249, 250, 251, 252.5, 253, 254],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comm-wheat',
    name: 'Trigo Paraná',
    unit: 'sc 60kg',
    marketReference: 'Moinhos PR (Deral)',
    priceBrl: 84.5,
    dailyChangePercent: 0.1,
    highBrl: 85.0,
    lowBrl: 84.0,
    weeklyTrend: [83.5, 84.0, 84.2, 84.0, 84.1, 84.4, 84.5],
    updatedAt: new Date().toISOString(),
  },
];

export const COMMODITY_TRANSLATIONS: Record<
  string,
  { name: { pt: string; en: string }; unit: { pt: string; en: string } }
> = {
  'comm-soy': {
    name: { pt: 'Soja em Grão', en: 'Soybeans' },
    unit: { pt: 'sc 60kg', en: '60kg bag' },
  },
  'comm-corn': {
    name: { pt: 'Milho Amarelo', en: 'Yellow Corn' },
    unit: { pt: 'sc 60kg', en: '60kg bag' },
  },
  'comm-coffee': {
    name: { pt: 'Café Arábica Tipo 6', en: 'Arabica Coffee' },
    unit: { pt: 'sc 60kg', en: '60kg bag' },
  },
  'comm-cattle': {
    name: { pt: 'Boi Gordo', en: 'Live Cattle' },
    unit: { pt: '@ 15kg', en: '15kg arroba' },
  },
  'comm-wheat': {
    name: { pt: 'Trigo Paraná', en: 'Paraná Wheat' },
    unit: { pt: 'sc 60kg', en: '60kg bag' },
  },
};

export function getCommodityName(id: string, fallback: string, lang: 'pt' | 'en' = 'pt'): string {
  return COMMODITY_TRANSLATIONS[id]?.name[lang] || fallback;
}

export function getCommodityUnit(id: string, fallback: string, lang: 'pt' | 'en' = 'pt'): string {
  return COMMODITY_TRANSLATIONS[id]?.unit[lang] || fallback;
}

export const marketService = {
  async getMarketSummary(): Promise<MarketSummary> {
    // Simulated live market feed with slight random delta
    await new Promise((res) => setTimeout(res, 80));

    return {
      dollarCommercialBrl: 5.62,
      dollarChangePercent: 0.28,
      quotes: INITIAL_QUOTES,
      lastSyncAt: new Date().toISOString(),
    };
  },

  calculateGrossLotValue(bagsCount: number, pricePerBag: number): number {
    return Math.round(bagsCount * pricePerBag);
  },
};
