export interface CommodityQuote {
  id: string;
  name: string;
  unit: string;
  marketReference: string;
  priceBrl: number;
  dailyChangePercent: number;
  highBrl: number;
  lowBrl: number;
  weeklyTrend: number[]; // 7 data points for sparkline
  updatedAt: string;
}

export interface MarketSummary {
  dollarCommercialBrl: number;
  dollarChangePercent: number;
  quotes: CommodityQuote[];
  lastSyncAt: string;
}
