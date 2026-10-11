import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AgriculturalMachine, MachineCategory } from '../types';
import { useMachinery } from '../hooks/useMachinery';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { colors, radii, spacing } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const MachineryFleetScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const {
    machines,
    filterCategory,
    setFilterCategory,
    toggleMachineOperation,
    operatingCount,
    maintenanceAlertCount,
    totalFleetHours,
  } = useMachinery();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const getCategoryIcon = (cat: MachineCategory): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (cat) {
      case 'TRACTOR':
        return 'tractor';
      case 'SPRAYER':
        return 'spray';
      case 'HARVESTER':
        return 'tractor-variant';
      case 'PLANTER':
        return 'seed';
      default:
        return 'wrench';
    }
  };

  const renderMachineItem: ListRenderItem<AgriculturalMachine> = ({ item }) => {
    const isOperating = item.status === 'OPERATING';
    const isMaintUrgent = item.nextMaintenanceInHours <= 50;

    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.categoryIconBadge,
                { backgroundColor: isOperating ? '#ECFDF5' : '#F1F5F9' },
                isDark && { backgroundColor: isOperating ? '#064E3B44' : '#1E293B' },
              ]}
            >
              <MaterialCommunityIcons
                name={getCategoryIcon(item.category)}
                size={22}
                color={isOperating ? '#059669' : '#64748B'}
              />
            </View>
            <View>
              <Text style={[styles.machineName, isDark && styles.machineNameDark]}>{item.name}</Text>
              <Text style={[styles.machineCode, isDark && styles.machineCodeDark]}>
                {item.code} · Ano {item.modelYear} · {item.currentField}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              isOperating ? styles.operatingBadge : styles.idleBadge,
              isDark && (isOperating ? styles.operatingBadgeDark : styles.idleBadgeDark),
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOperating ? '#10B981' : '#64748B' },
              ]}
            />
            <Text
              style={[
                styles.statusBadgeText,
                { color: isOperating ? '#10B981' : '#64748B' },
              ]}
            >
              {isOperating ? 'Em Operação' : 'Parado'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricBox, isDark && styles.metricBoxDark]}>
            <Text style={styles.metricLabel}>Horímetro</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {item.hoursWorked.toFixed(1)} h
            </Text>
          </View>

          <View style={[styles.metricBox, isDark && styles.metricBoxDark]}>
            <Text style={styles.metricLabel}>Velocidade</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {item.currentSpeedKmH.toFixed(1)} km/h
            </Text>
          </View>

          <View style={[styles.metricBox, isDark && styles.metricBoxDark]}>
            <Text style={styles.metricLabel}>Consumo</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {item.fuelConsumptionLPerHour.toFixed(1)} L/h
            </Text>
          </View>

          <View style={[styles.metricBox, isDark && styles.metricBoxDark]}>
            <Text style={styles.metricLabel}>Rotação RPM</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {item.engineRpm}
            </Text>
          </View>
        </View>

        <View style={styles.fuelSection}>
          <View style={styles.fuelLabelRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons name="gas-station" size={14} color="#64748B" />
              <Text style={[styles.gaugeLabel, isDark && styles.gaugeLabelDark]}>Tanque Diesel</Text>
            </View>
            <Text style={[styles.gaugeVal, isDark && styles.gaugeValDark]}>{item.fuelLevelPercent}%</Text>
          </View>
          <View style={[styles.progressBarBg, isDark && styles.progressBarBgDark]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.fuelLevelPercent}%`,
                  backgroundColor:
                    item.fuelLevelPercent > 40 ? '#059669' : item.fuelLevelPercent > 20 ? '#F59E0B' : '#EF4444',
                },
              ]}
            />
          </View>
        </View>

        <View
          style={[
            styles.maintBanner,
            isMaintUrgent ? styles.maintUrgent : styles.maintOk,
            isDark && (isMaintUrgent ? styles.maintUrgentDark : styles.maintOkDark),
          ]}
        >
          <MaterialCommunityIcons
            name={isMaintUrgent ? 'alert-octagon-outline' : 'shield-check-outline'}
            size={16}
            color={isMaintUrgent ? '#EF4444' : '#059669'}
          />
          <Text
            style={[
              styles.maintText,
              { color: isMaintUrgent ? '#DC2626' : '#059669' },
            ]}
          >
            {isMaintUrgent
              ? `Revisão Preventiva Crítica em ${item.nextMaintenanceInHours.toFixed(0)} horas!`
              : `Próxima revisão em ${item.nextMaintenanceInHours.toFixed(0)} horas de operação`}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <MaterialCommunityIcons name="account-hard-hat" size={16} color="#64748B" />
            <Text style={[styles.operatorText, isDark && styles.operatorTextDark]} numberOfLines={1}>
              {item.operator}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleMachineOperation(item.id)}
            style={[
              styles.actionBtn,
              isOperating ? styles.actionBtnStop : styles.actionBtnStart,
            ]}
          >
            <MaterialCommunityIcons
              name={isOperating ? 'power' : 'engine'}
              size={15}
              color="#FFFFFF"
            />
            <Text style={styles.actionBtnText}>
              {isOperating ? 'Desligar' : 'Ligar Telemetria'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={[styles.backBtn, isDark && styles.backBtnDark]}
              accessibilityLabel="Voltar"
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {language === 'en' ? 'Fleet & Farm Machinery' : 'Máquinas & Frota Agrícola'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en' ? 'Telemetry, telemetry & preventive maintenance' : 'Telemetria, horímetro e manutenção preventiva'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#059669' }]}>{operatingCount}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Em Campo</Text>
            <Text style={styles.kpiSub}>Operando agora</Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#3B82F6' }]}>{totalFleetHours.toFixed(0)}h</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Horímetro Total</Text>
            <Text style={styles.kpiSub}>Frota geral</Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: maintenanceAlertCount > 0 ? '#EF4444' : '#10B981' }]}>
              {maintenanceAlertCount}
            </Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Revisões &lt;50h</Text>
            <Text style={styles.kpiSub}>Troca de óleo/filtros</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {[
            { id: 'ALL', label: 'Todas as Máquinas' },
            { id: 'TRACTOR', label: 'Tratores' },
            { id: 'SPRAYER', label: 'Pulverizadores' },
            { id: 'HARVESTER', label: 'Colheitadeiras' },
            { id: 'PLANTER', label: 'Plantadeiras' },
          ].map((tab) => {
            const isSelected = filterCategory === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  void triggerHaptic('selection');
                  setFilterCategory(tab.id as any);
                }}
                style={[
                  styles.filterPill,
                  isDark && styles.filterPillDark,
                  isSelected && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isDark && styles.filterPillTextDark,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={renderMachineItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="tractor"
            title="Nenhum Equipamento Encontrado"
            description="Não há maquinários registrados nesta categoria no momento."
          />
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  backBtnDark: {
    backgroundColor: '#1E293B',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  kpiCardDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  kpiLabelDark: {
    color: '#E2E8F0',
  },
  kpiSub: {
    fontSize: 9,
    color: '#64748B',
  },
  filterTabs: {
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  filterPillActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextDark: {
    color: '#94A3B8',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl + 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  categoryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  machineNameDark: {
    color: '#FFFFFF',
  },
  machineCode: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  machineCodeDark: {
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  operatingBadge: {
    backgroundColor: '#ECFDF5',
  },
  operatingBadgeDark: {
    backgroundColor: '#064E3B44',
  },
  idleBadge: {
    backgroundColor: '#F1F5F9',
  },
  idleBadgeDark: {
    backgroundColor: '#1E293B',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.sm,
    padding: 8,
    alignItems: 'center',
  },
  metricBoxDark: {
    backgroundColor: '#121F17',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  metricValDark: {
    color: '#E2E8F0',
  },
  fuelSection: {
    marginBottom: spacing.sm,
  },
  fuelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gaugeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  gaugeLabelDark: {
    color: '#94A3B8',
  },
  gaugeVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  gaugeValDark: {
    color: '#E2E8F0',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarBgDark: {
    backgroundColor: '#1E293B',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  maintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  maintOk: {
    backgroundColor: '#ECFDF5',
  },
  maintOkDark: {
    backgroundColor: '#064E3B33',
  },
  maintUrgent: {
    backgroundColor: '#FEF2F2',
  },
  maintUrgentDark: {
    backgroundColor: '#450A0A44',
  },
  maintText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  operatorText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  operatorTextDark: {
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  actionBtnStart: {
    backgroundColor: '#059669',
  },
  actionBtnStop: {
    backgroundColor: '#475569',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
