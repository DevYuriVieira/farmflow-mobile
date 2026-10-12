import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { InventoryItem, GrainContract, InventoryCategory } from '../types';
import { useInventory } from '../hooks/useInventory';
import { styles } from '../styles/inventoryWarehouse.styles';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const InventoryWarehouseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const {
    items,
    contracts,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    adjustStock,
    deliverGrainBags,
    kpis,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'CONTRACTS'>('INVENTORY');
  const [selectedItemForAction, setSelectedItemForAction] = useState<InventoryItem | null>(null);
  const [actionQuantity, setActionQuantity] = useState('');
  const [actionType, setActionType] = useState<'ADD' | 'DISPATCH'>('DISPATCH');

  const [selectedContract, setSelectedContract] = useState<GrainContract | null>(null);
  const [contractDeliveryBags, setContractDeliveryBags] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const getCategoryIcon = (
    cat: InventoryCategory
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (cat) {
      case 'SEEDS':
        return 'seed';
      case 'FERTILIZER':
        return 'sack';
      case 'DEFENSIVE':
        return 'bottle-tonic-skull-outline';
      case 'FUEL':
        return 'gas-station';
      case 'BIOLOGICAL':
        return 'leaf';
      default:
        return 'package-variant';
    }
  };

  const getCategoryColor = (cat: InventoryCategory): string => {
    switch (cat) {
      case 'SEEDS':
        return '#10B981';
      case 'FERTILIZER':
        return '#F59E0B';
      case 'DEFENSIVE':
        return '#EF4444';
      case 'FUEL':
        return '#3B82F6';
      case 'BIOLOGICAL':
        return '#8B5CF6';
      default:
        return colors.primary;
    }
  };

  const openStockModal = (item: InventoryItem, type: 'ADD' | 'DISPATCH') => {
    triggerHaptic();
    setSelectedItemForAction(item);
    setActionType(type);
    setActionQuantity('');
  };

  const handleConfirmStockAction = () => {
    if (!selectedItemForAction) return;
    const qty = parseFloat(actionQuantity);
    if (isNaN(qty) || qty <= 0) return;

    triggerHaptic();
    const delta = actionType === 'ADD' ? qty : -qty;
    adjustStock(selectedItemForAction.id, delta);
    setSelectedItemForAction(null);
  };

  const openContractModal = (contract: GrainContract) => {
    triggerHaptic();
    setSelectedContract(contract);
    setContractDeliveryBags('');
  };

  const handleConfirmContractDelivery = () => {
    if (!selectedContract) return;
    const bags = parseInt(contractDeliveryBags, 10);
    if (isNaN(bags) || bags <= 0) return;

    triggerHaptic();
    deliverGrainBags(selectedContract.id, bags);
    setSelectedContract(null);
  };

  const categories: { key: InventoryCategory | 'ALL'; label: string }[] = [
    { key: 'ALL', label: language === 'en' ? 'All' : 'Todos' },
    { key: 'DEFENSIVE', label: language === 'en' ? 'Defensives' : 'Defensivos' },
    { key: 'FERTILIZER', label: language === 'en' ? 'Fertilizers' : 'Fertilizantes' },
    { key: 'SEEDS', label: language === 'en' ? 'Seeds' : 'Sementes' },
    { key: 'FUEL', label: language === 'en' ? 'Fuel / Diesel' : 'Combustível' },
    { key: 'BIOLOGICAL', label: language === 'en' ? 'Biologicals' : 'Biológicos' },
  ];

  const renderInventoryItem: ListRenderItem<InventoryItem> = ({ item }) => {
    const isLow = item.currentStock <= item.minStockAlert;
    const totalItemValue = item.currentStock * item.unitCostBrl;
    const stockRatio = Math.min(1, item.currentStock / (item.minStockAlert * 2 || 1));

    return (
      <View
        style={[
          styles.itemCard,
          isDark && styles.itemCardDark,
          isLow && styles.itemCardWarning,
        ]}
      >
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${getCategoryColor(item.category)}20` },
            ]}
          >
            <MaterialCommunityIcons
              name={getCategoryIcon(item.category)}
              size={22}
              color={getCategoryColor(item.category)}
            />
          </View>
          <View style={styles.itemTitleCol}>
            <Text style={[styles.itemName, isDark && styles.textLight]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.itemSub, isDark && styles.textMuted]}>
              {item.storageLocation} • {item.batchNumber}
            </Text>
          </View>
          {isLow ? (
            <View style={styles.lowStockBadge}>
              <MaterialCommunityIcons name="alert-circle" size={14} color="#EF4444" />
              <Text style={styles.lowStockText}>
                {language === 'en' ? 'Low Stock' : 'Estoque Baixo'}
              </Text>
            </View>
          ) : (
            <View style={styles.okStockBadge}>
              <Text style={styles.okStockText}>
                {language === 'en' ? 'In Stock' : 'Em Dia'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.stockProgressContainer}>
          <View
            style={[
              styles.stockProgressBar,
              {
                width: `${Math.round(stockRatio * 100)}%`,
                backgroundColor: isLow ? '#EF4444' : '#10B981',
              },
            ]}
          />
        </View>

        <View style={styles.metricsRow}>
          <View>
            <Text style={[styles.metricLabel, isDark && styles.textMuted]}>
              {language === 'en' ? 'Current Quantity' : 'Quantidade Atual'}
            </Text>
            <Text
              style={[
                styles.metricVal,
                isDark && styles.textLight,
                isLow && { color: '#EF4444' },
              ]}
            >
              {item.currentStock.toLocaleString()} {item.unit}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.metricLabel, isDark && styles.textMuted]}>
              {language === 'en' ? 'Asset Value' : 'Valor em Estoque'}
            </Text>
            <Text style={[styles.metricVal, isDark && styles.textLight]}>
              R$ {totalItemValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {item.mapaRegistration ? (
          <Text style={[styles.mapaText, isDark && styles.textMuted]}>
            Reg: {item.mapaRegistration} • Exp: {item.expirationDate}
          </Text>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.btnAction, styles.btnDispatch]}
            onPress={() => openStockModal(item, 'DISPATCH')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="tray-minus" size={16} color="#DC2626" />
            <Text style={styles.btnDispatchText}>
              {language === 'en' ? 'Apply in Field' : 'Baixa na Lavoura'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, styles.btnReplenish]}
            onPress={() => openStockModal(item, 'ADD')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="tray-plus" size={16} color="#059669" />
            <Text style={styles.btnReplenishText}>
              {language === 'en' ? 'Receive Batch' : 'Receber Carga'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContractItem: ListRenderItem<GrainContract> = ({ item }) => {
    const isFulfilled = item.status === 'FULFILLED';
    const progress = Math.min(1, item.bagsDelivered / (item.bagsContracted || 1));
    const totalVal = item.bagsContracted * item.pricePerBagBrl;

    return (
      <View
        style={[
          styles.itemCard,
          isDark && styles.itemCardDark,
          isFulfilled && styles.cardFulfilled,
        ]}
      >
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: item.commodity === 'SOY' ? '#10B98120' : '#F59E0B20' },
            ]}
          >
            <MaterialCommunityIcons
              name={item.commodity === 'SOY' ? 'sprout' : 'corn'}
              size={22}
              color={item.commodity === 'SOY' ? '#10B981' : '#F59E0B'}
            />
          </View>
          <View style={styles.itemTitleCol}>
            <Text style={[styles.itemName, isDark && styles.textLight]} numberOfLines={1}>
              {item.buyer}
            </Text>
            <Text style={[styles.itemSub, isDark && styles.textMuted]}>
              {item.commodity} • {item.modality.replace('_', ' ')}
            </Text>
          </View>
          <View
            style={[
              styles.contractStatusBadge,
              { backgroundColor: isFulfilled ? '#ECFDF5' : '#EFF6FF' },
              isDark && { backgroundColor: isFulfilled ? '#064E3B44' : '#1E3A8A44' },
            ]}
          >
            <Text
              style={[
                styles.contractStatusText,
                { color: isFulfilled ? '#059669' : '#2563EB' },
              ]}
            >
              {isFulfilled
                ? language === 'en'
                  ? 'Fulfilled'
                  : 'Liquidado'
                : language === 'en'
                ? 'In Progress'
                : 'Em Entrega'}
            </Text>
          </View>
        </View>

        {item.barterExchangeItem ? (
          <View
            style={[
              styles.barterBox,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
            ]}
          >
            <MaterialCommunityIcons name="swap-horizontal" size={16} color="#F59E0B" />
            <Text style={[styles.barterText, isDark && styles.textLight]} numberOfLines={1}>
              {item.barterExchangeItem}
            </Text>
          </View>
        ) : null}

        <View style={styles.stockProgressContainer}>
          <View
            style={[
              styles.stockProgressBar,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: isFulfilled ? '#10B981' : '#3B82F6',
              },
            ]}
          />
        </View>

        <View style={styles.metricsRow}>
          <View>
            <Text style={[styles.metricLabel, isDark && styles.textMuted]}>
              {language === 'en' ? 'Bags Delivered' : 'Sacas Entregues'}
            </Text>
            <Text style={[styles.metricVal, isDark && styles.textLight]}>
              {item.bagsDelivered.toLocaleString()} / {item.bagsContracted.toLocaleString()} sc
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.metricLabel, isDark && styles.textMuted]}>
              {language === 'en' ? 'Contract Value' : 'Valor Total Contrato'}
            </Text>
            <Text style={[styles.metricVal, isDark && styles.textLight]}>
              R$ {totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={styles.deliveryFooter}>
          <Text style={[styles.deliveryDate, isDark && styles.textMuted]}>
            {language === 'en' ? 'Deadline' : 'Prazo'}: {item.deliveryDeadline} (R$ {item.pricePerBagBrl}/sc)
          </Text>
          {!isFulfilled ? (
            <TouchableOpacity
              style={styles.btnDeliverGrain}
              onPress={() => openContractModal(item)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="truck-delivery" size={16} color="#FFFFFF" />
              <Text style={styles.btnDeliverGrainText}>
                {language === 'en' ? 'Dispatch Bags' : 'Despachar Carga'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <Screen style={styles.screen}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={isDark ? '#F8FAFC' : '#0F172A'}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, isDark && styles.textLight]}>
            {language === 'en' ? 'Supplies & Grain Sales' : 'Insumos & Comercialização'}
          </Text>
          <Text style={[styles.subtitle, isDark && styles.textMuted]}>
            {language === 'en'
              ? 'Input Warehouse, Defensives & Barter Contracts'
              : 'Armazém de Defensivos, Adubos e Contratos Futuros'}
          </Text>
        </View>
      </View>

      <View style={styles.kpiContainer}>
        <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
          <Text style={[styles.kpiLabel, isDark && styles.textMuted]}>
            {language === 'en' ? 'Supplies Asset' : 'Imobilizado em Insumos'}
          </Text>
          <Text style={[styles.kpiValue, isDark && styles.textLight]}>
            R$ {(kpis.totalStockValueBrl / 1000).toFixed(1)}k
          </Text>
          <Text style={styles.kpiSub}>
            {kpis.lowStockCount}{' '}
            {language === 'en' ? 'critical alerts' : 'itens em alerta'}
          </Text>
        </View>

        <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
          <Text style={[styles.kpiLabel, isDark && styles.textMuted]}>
            {language === 'en' ? 'Grain Contracts' : 'Contratos Travados'}
          </Text>
          <Text style={[styles.kpiValue, isDark && styles.textLight]}>
            R$ {(kpis.totalContractValueBrl / 1000000).toFixed(2)}M
          </Text>
          <Text style={[styles.kpiSub, { color: '#059669' }]}>
            {kpis.fulfillmentRatePercent}%{' '}
            {language === 'en' ? 'delivered' : 'entregue'}
          </Text>
        </View>
      </View>

      <View style={[styles.tabsNav, isDark && styles.tabsNavDark]}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'INVENTORY' && styles.tabItemActive,
            activeTab === 'INVENTORY' && isDark && styles.tabItemActiveDark,
          ]}
          onPress={() => {
            triggerHaptic();
            setActiveTab('INVENTORY');
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="warehouse"
            size={18}
            color={
              activeTab === 'INVENTORY'
                ? '#FFFFFF'
                : isDark
                ? '#94A3B8'
                : '#64748B'
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'INVENTORY' && styles.tabTextActive,
              isDark && activeTab !== 'INVENTORY' && styles.textMuted,
            ]}
          >
            {language === 'en' ? 'Input Warehouse' : 'Armazém de Insumos'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'CONTRACTS' && styles.tabItemActive,
            activeTab === 'CONTRACTS' && isDark && styles.tabItemActiveDark,
          ]}
          onPress={() => {
            triggerHaptic();
            setActiveTab('CONTRACTS');
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="handshake-outline"
            size={18}
            color={
              activeTab === 'CONTRACTS'
                ? '#FFFFFF'
                : isDark
                ? '#94A3B8'
                : '#64748B'
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'CONTRACTS' && styles.tabTextActive,
              isDark && activeTab !== 'CONTRACTS' && styles.textMuted,
            ]}
          >
            {language === 'en' ? 'Grain Sales & Barter' : 'Venda de Grãos & Barter'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'INVENTORY' ? (
        <>
          <View style={[styles.searchBox, isDark && styles.searchBoxDark]}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={isDark ? '#94A3B8' : '#64748B'}
            />
            <TextInput
              style={[styles.searchInput, isDark && styles.textLight]}
              placeholder={
                language === 'en'
                  ? 'Search chemicals, seeds, batches...'
                  : 'Buscar insumo, lote ou galpão...'
              }
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={isDark ? '#94A3B8' : '#64748B'}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((c) => {
              const isSelected = filterCategory === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[
                    styles.catChip,
                    isDark && styles.catChipDark,
                    isSelected && styles.catChipActive,
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    setFilterCategory(c.key);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      isDark && styles.textLight,
                      isSelected && styles.catChipTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderInventoryItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="package-variant"
                title={language === 'en' ? 'No items found' : 'Nenhum insumo encontrado'}
                description={
                  language === 'en'
                    ? 'Try searching with another name or category.'
                    : 'Tente buscar por outro termo ou categoria.'
                }
              />
            }
          />
        </>
      ) : (
        <FlatList
          data={contracts}
          keyExtractor={(c) => c.id}
          renderItem={renderContractItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        visible={!!selectedItemForAction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItemForAction(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textLight]}>
              {actionType === 'ADD'
                ? language === 'en'
                  ? 'Receive Shipment'
                  : 'Entrada de Carga'
                : language === 'en'
                ? 'Apply in Field'
                : 'Baixa para Aplicação'}
            </Text>
            <Text style={[styles.modalSub, isDark && styles.textMuted]}>
              {selectedItemForAction?.name} ({selectedItemForAction?.unit})
            </Text>

            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder={
                language === 'en'
                  ? `Quantity in ${selectedItemForAction?.unit}`
                  : `Quantidade em ${selectedItemForAction?.unit}`
              }
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="numeric"
              value={actionQuantity}
              onChangeText={setActionQuantity}
              autoFocus
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setSelectedItemForAction(null)}
              >
                <Text style={styles.modalBtnCancelText}>
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  actionType === 'ADD' ? styles.btnReplenish : styles.btnDispatch,
                ]}
                onPress={handleConfirmStockAction}
              >
                <Text
                  style={
                    actionType === 'ADD'
                      ? styles.btnReplenishText
                      : styles.btnDispatchText
                  }
                >
                  {language === 'en' ? 'Confirm' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contract Delivery Modal */}
      <Modal
        visible={!!selectedContract}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedContract(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textLight]}>
              {language === 'en' ? 'Dispatch Grain Bags' : 'Registrar Entrega de Grãos'}
            </Text>
            <Text style={[styles.modalSub, isDark && styles.textMuted]}>
              {selectedContract?.buyer} ({selectedContract?.commodity})
            </Text>

            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder={
                language === 'en'
                  ? 'Number of bags (60kg)'
                  : 'Quantidade de sacas (60kg)'
              }
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="numeric"
              value={contractDeliveryBags}
              onChangeText={setContractDeliveryBags}
              autoFocus
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setSelectedContract(null)}
              >
                <Text style={styles.modalBtnCancelText}>
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.btnDeliverGrain]}
                onPress={handleConfirmContractDelivery}
              >
                <Text style={styles.btnDeliverGrainText}>
                  {language === 'en' ? 'Confirm Delivery' : 'Confirmar Envio'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

