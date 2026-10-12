import { useState, useMemo, useCallback } from 'react';
import { InventoryItem, GrainContract, InventoryCategory } from '../types';
import {
  calculateTotalStockValue,
  countLowStockItems,
  calculateContractMetrics,
  applyStockDelta,
  applyGrainDelivery,
} from '../services/inventoryService';

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    name: 'Glifosato Roundup Transorb',
    category: 'DEFENSIVE',
    currentStock: 450,
    unit: 'L',
    minStockAlert: 200,
    unitCostBrl: 48.5,
    batchNumber: 'GLY-2026-X8',
    expirationDate: '2027-04-15',
    storageLocation: 'Galpão Defensivos - Box 02',
    mapaRegistration: 'MAPA 009395',
  },
  {
    id: 'inv-02',
    name: 'Ureia Protegida 46% N',
    category: 'FERTILIZER',
    currentStock: 18,
    unit: 'ton',
    minStockAlert: 25,
    unitCostBrl: 3250.0,
    batchNumber: 'URE-9941',
    expirationDate: '2028-01-10',
    storageLocation: 'Armazém Central - Baia 01',
  },
  {
    id: 'inv-03',
    name: 'Semente Soja Monsoy 5947 IPRO',
    category: 'SEEDS',
    currentStock: 120,
    unit: 'sc',
    minStockAlert: 50,
    unitCostBrl: 285.0,
    batchNumber: 'MSO-5947-B2',
    expirationDate: '2026-12-01',
    storageLocation: 'Câmara Fria Sementes',
  },
  {
    id: 'inv-04',
    name: 'Óleo Diesel S10 Agrícola',
    category: 'FUEL',
    currentStock: 3200,
    unit: 'L',
    minStockAlert: 4000,
    unitCostBrl: 5.85,
    batchNumber: 'DSL-OUT-26',
    expirationDate: '2026-11-30',
    storageLocation: 'Tanque Estacionário 15.000L',
  },
  {
    id: 'inv-05',
    name: 'Fungicida Elatus (Azoxistrobina + Benzovindiflupir)',
    category: 'DEFENSIVE',
    currentStock: 85,
    unit: 'kg',
    minStockAlert: 100,
    unitCostBrl: 310.0,
    batchNumber: 'ELA-4011',
    expirationDate: '2027-08-20',
    storageLocation: 'Galpão Defensivos - Box 01',
    mapaRegistration: 'MAPA 007414',
  },
  {
    id: 'inv-06',
    name: 'Inoculante Biológico Trichoderma Harzianum',
    category: 'BIOLOGICAL',
    currentStock: 95,
    unit: 'L',
    minStockAlert: 40,
    unitCostBrl: 62.0,
    batchNumber: 'BIO-TRICH-9',
    expirationDate: '2027-02-18',
    storageLocation: 'Câmara Fria Sementes',
  },
];

const INITIAL_CONTRACTS: GrainContract[] = [
  {
    id: 'ctr-01',
    commodity: 'SOY',
    buyer: 'Cargill Agrícola S.A.',
    bagsContracted: 10000,
    bagsDelivered: 6500,
    pricePerBagBrl: 138.5,
    modality: 'FORWARD_CONTRACT',
    deliveryDeadline: '2027-03-30',
    status: 'ACTIVE',
  },
  {
    id: 'ctr-02',
    commodity: 'SOY',
    buyer: 'Bunge Alimentos',
    bagsContracted: 4500,
    bagsDelivered: 4500,
    pricePerBagBrl: 142.0,
    modality: 'BARTER',
    barterExchangeItem: 'Troca por Fertilizante NPK 04-14-08 (120 ton)',
    deliveryDeadline: '2026-11-15',
    status: 'FULFILLED',
  },
  {
    id: 'ctr-03',
    commodity: 'CORN',
    buyer: 'Amaggi Exportação',
    bagsContracted: 8000,
    bagsDelivered: 1200,
    pricePerBagBrl: 64.0,
    modality: 'SPOT_FIXED',
    deliveryDeadline: '2027-07-20',
    status: 'ACTIVE',
  },
];

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [contracts, setContracts] = useState<GrainContract[]>(INITIAL_CONTRACTS);
  const [filterCategory, setFilterCategory] = useState<InventoryCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const adjustStock = useCallback((itemId: string, deltaAmount: number) => {
    setItems((prev) => applyStockDelta(prev, itemId, deltaAmount));
  }, []);

  const addInventoryItem = useCallback((newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: `inv-${Date.now()}`,
    };
    setItems((prev) => [item, ...prev]);
  }, []);

  const deliverGrainBags = useCallback((contractId: string, additionalBags: number) => {
    setContracts((prev) => applyGrainDelivery(prev, contractId, additionalBags));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filterCategory === 'ALL' || item.category === filterCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, filterCategory, searchQuery]);

  const kpis = useMemo(() => {
    const totalStockValueBrl = calculateTotalStockValue(items);
    const lowStockCount = countLowStockItems(items);
    const contractMetrics = calculateContractMetrics(contracts);

    return {
      totalStockValueBrl,
      lowStockCount,
      ...contractMetrics,
    };
  }, [items, contracts]);

  return {
    items: filteredItems,
    allItemsCount: items.length,
    contracts,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    adjustStock,
    addInventoryItem,
    deliverGrainBags,
    kpis,
  };
};
