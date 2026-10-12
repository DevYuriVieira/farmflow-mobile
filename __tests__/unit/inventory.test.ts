import {
  calculateTotalStockValue,
  countLowStockItems,
  calculateContractMetrics,
  applyStockDelta,
  applyGrainDelivery,
} from '../../src/features/inventory/services/inventoryService';
import { InventoryItem, GrainContract } from '../../src/features/inventory/types';

describe('Inventory & Grain Contracts Domain Service', () => {
  const sampleItems: InventoryItem[] = [
    {
      id: 'item-1',
      name: 'Roundup Transorb',
      category: 'DEFENSIVE',
      currentStock: 100,
      unit: 'L',
      minStockAlert: 150,
      unitCostBrl: 50,
      batchNumber: 'B1',
      expirationDate: '2027-01-01',
      storageLocation: 'Box 1',
    },
    {
      id: 'item-2',
      name: 'Ureia Protegida',
      category: 'FERTILIZER',
      currentStock: 200,
      unit: 'kg',
      minStockAlert: 100,
      unitCostBrl: 10,
      batchNumber: 'B2',
      expirationDate: '2028-01-01',
      storageLocation: 'Box 2',
    },
  ];

  const sampleContracts: GrainContract[] = [
    {
      id: 'ctr-1',
      commodity: 'SOY',
      buyer: 'Cargill',
      bagsContracted: 1000,
      bagsDelivered: 400,
      pricePerBagBrl: 140,
      modality: 'FORWARD_CONTRACT',
      deliveryDeadline: '2027-05-01',
      status: 'ACTIVE',
    },
    {
      id: 'ctr-2',
      commodity: 'CORN',
      buyer: 'Bunge',
      bagsContracted: 500,
      bagsDelivered: 500,
      pricePerBagBrl: 60,
      modality: 'BARTER',
      deliveryDeadline: '2027-04-01',
      status: 'FULFILLED',
    },
  ];

  test('calculates total asset valuation in stock', () => {
    const totalVal = calculateTotalStockValue(sampleItems);
    expect(totalVal).toBe(100 * 50 + 200 * 10);
  });

  test('identifies items below minimum threshold', () => {
    const lowCount = countLowStockItems(sampleItems);
    expect(lowCount).toBe(1);
  });

  test('calculates grain contract fulfillment and financial values', () => {
    const metrics = calculateContractMetrics(sampleContracts);
    expect(metrics.totalContractedBags).toBe(1500);
    expect(metrics.totalDeliveredBags).toBe(900);
    expect(metrics.totalContractValueBrl).toBe(1000 * 140 + 500 * 60);
    expect(metrics.fulfillmentRatePercent).toBe(60);
  });

  test('applies stock delta on dispatch and intake safely without negative stocks', () => {
    const dispatched = applyStockDelta(sampleItems, 'item-1', -40);
    expect(dispatched.find((i) => i.id === 'item-1')?.currentStock).toBe(60);

    const overDispatched = applyStockDelta(sampleItems, 'item-1', -200);
    expect(overDispatched.find((i) => i.id === 'item-1')?.currentStock).toBe(0);

    const received = applyStockDelta(sampleItems, 'item-2', 50);
    expect(received.find((i) => i.id === 'item-2')?.currentStock).toBe(250);
  });

  test('updates contract delivery bags and marks fulfilled when reached', () => {
    const updated = applyGrainDelivery(sampleContracts, 'ctr-1', 600);
    const contract = updated.find((c) => c.id === 'ctr-1');
    expect(contract?.bagsDelivered).toBe(1000);
    expect(contract?.status).toBe('FULFILLED');
  });
});
