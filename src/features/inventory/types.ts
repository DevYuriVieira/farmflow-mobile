export type InventoryCategory =
  | 'SEEDS'
  | 'FERTILIZER'
  | 'DEFENSIVE'
  | 'FUEL'
  | 'BIOLOGICAL';

export type StockUnit = 'L' | 'kg' | 'sc' | 'ton';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  unit: StockUnit;
  minStockAlert: number;
  unitCostBrl: number;
  batchNumber: string;
  expirationDate: string;
  storageLocation: string;
  mapaRegistration?: string;
}

export type CommodityType = 'SOY' | 'CORN' | 'COFFEE' | 'WHEAT';

export type ContractModality = 'BARTER' | 'FORWARD_CONTRACT' | 'SPOT_FIXED';

export type ContractStatus = 'ACTIVE' | 'FULFILLED' | 'PENDING';

export interface GrainContract {
  id: string;
  commodity: CommodityType;
  buyer: string;
  bagsContracted: number;
  bagsDelivered: number;
  pricePerBagBrl: number;
  modality: ContractModality;
  barterExchangeItem?: string;
  deliveryDeadline: string;
  status: ContractStatus;
}
