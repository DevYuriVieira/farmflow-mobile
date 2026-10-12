import { InventoryItem, GrainContract } from '../types';

export const calculateTotalStockValue = (items: InventoryItem[]): number => {
  return items.reduce((acc, item) => acc + item.currentStock * item.unitCostBrl, 0);
};

export const countLowStockItems = (items: InventoryItem[]): number => {
  return items.filter((item) => item.currentStock <= item.minStockAlert).length;
};

export const calculateContractMetrics = (contracts: GrainContract[]) => {
  const totalContractedBags = contracts.reduce((acc, c) => acc + c.bagsContracted, 0);
  const totalDeliveredBags = contracts.reduce((acc, c) => acc + c.bagsDelivered, 0);
  const totalContractValueBrl = contracts.reduce(
    (acc, c) => acc + c.bagsContracted * c.pricePerBagBrl,
    0
  );
  const fulfillmentRatePercent =
    totalContractedBags > 0
      ? Math.round((totalDeliveredBags / totalContractedBags) * 100)
      : 0;

  return {
    totalContractedBags,
    totalDeliveredBags,
    totalContractValueBrl,
    fulfillmentRatePercent,
  };
};

export const applyStockDelta = (
  items: InventoryItem[],
  itemId: string,
  deltaAmount: number
): InventoryItem[] => {
  return items.map((item) => {
    if (item.id === itemId) {
      const nextStock = Math.max(0, Number((item.currentStock + deltaAmount).toFixed(2)));
      return { ...item, currentStock: nextStock };
    }
    return item;
  });
};

export const applyGrainDelivery = (
  contracts: GrainContract[],
  contractId: string,
  additionalBags: number
): GrainContract[] => {
  return contracts.map((contract) => {
    if (contract.id === contractId) {
      const nextDelivered = Math.min(
        contract.bagsContracted,
        contract.bagsDelivered + additionalBags
      );
      const nextStatus =
        nextDelivered >= contract.bagsContracted ? 'FULFILLED' : 'ACTIVE';
      return {
        ...contract,
        bagsDelivered: nextDelivered,
        status: nextStatus,
      };
    }
    return contract;
  });
};
