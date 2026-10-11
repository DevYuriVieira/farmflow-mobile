import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { SprayApplication } from '../types';
import { useSpraying, calculateDriftRisk } from '../hooks/useSpraying';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { colors, radii, spacing } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const SprayDiaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const {
    applications,
    isLoading,
    inGraceCount,
    safeCount,
    addApplication,
    deleteApplication,
  } = useSpraying();

  const [modalVisible, setModalVisible] = useState(false);

  const [plantationName, setPlantationName] = useState('Talhão 02 — Milho Safrinha');
  const [targetPest, setTargetPest] = useState('Cigarrinha & Lagarta');
  const [productName, setProductName] = useState('Connect + Belt');
  const [activeIngredient, setActiveIngredient] = useState('Flubendiamida + Beta-ciflutrina');
  const [dosePerHectare, setDosePerHectare] = useState('0.4 L/ha');
  const [sprayVolume, setSprayVolume] = useState('120');
  const [treatedArea, setTreatedArea] = useState('30');
  const [nozzleType, setNozzleType] = useState('Indução de Ar AIXR 11002');
  const [graceDays, setGraceDays] = useState('14');
  const [tempC, setTempC] = useState('24');
  const [humidity, setHumidity] = useState('65');
  const [windKmH, setWindKmH] = useState('6');
  const [operatorName, setOperatorName] = useState('Operador Fazenda');
  const [notes, setNotes] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const handleSave = async () => {
    const wind = parseFloat(windKmH) || 5;
    const hum = parseFloat(humidity) || 60;
    const temp = parseFloat(tempC) || 25;
    const driftRisk = calculateDriftRisk(wind, hum, temp);

    await addApplication({
      farmId: 'farm-1',
      plantationName,
      targetPest,
      productName,
      activeIngredient,
      dosePerHectare,
      sprayVolumeLPerHa: parseFloat(sprayVolume) || 120,
      totalTreatedAreaHa: parseFloat(treatedArea) || 20,
      nozzleType,
      appliedAt: new Date().toISOString(),
      withdrawalPeriodDays: parseInt(graceDays, 10) || 7,
      temperatureC: temp,
      humidityPercent: hum,
      windSpeedKmH: wind,
      driftRisk,
      operatorName,
      notes,
    });

    setModalVisible(false);
  };

  const getDaysRemaining = (safeDateStr: string) => {
    const diff = new Date(safeDateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const renderItem: ListRenderItem<SprayApplication> = ({ item }) => {
    const daysLeft = getDaysRemaining(item.harvestSafeDate);
    const isGrace = item.status === 'IN_GRACE_PERIOD' && daysLeft > 0;

    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.productName}</Text>
            <Text style={[styles.cardSubtitle, isDark && styles.cardSubtitleDark]}>
              {item.plantationName} · {item.targetPest}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isGrace ? styles.graceBadge : styles.safeBadge,
              isDark && (isGrace ? styles.graceBadgeDark : styles.safeBadgeDark),
            ]}
          >
            <MaterialCommunityIcons
              name={isGrace ? 'shield-alert-outline' : 'shield-check-outline'}
              size={14}
              color={isGrace ? '#EF4444' : '#10B981'}
            />
            <Text style={[styles.statusBadgeText, { color: isGrace ? '#EF4444' : '#10B981' }]}>
              {isGrace ? `Carência: ${daysLeft}d restantes` : 'Liberado p/ Colheita'}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Ingrediente Ativo</Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]} numberOfLines={1}>
              {item.activeIngredient}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Dose / Calda</Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {item.dosePerHectare} · {item.sprayVolumeLPerHa} L/ha
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Ponta de Pulverização</Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]} numberOfLines={1}>
              {item.nozzleType}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Condições de Aplicação</Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {item.windSpeedKmH} km/h · {item.humidityPercent}% RH · {item.temperatureC}°C
            </Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={[styles.notesText, isDark && styles.notesTextDark]}>{item.notes}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
            Aplicado em {new Date(item.appliedAt).toLocaleDateString('pt-BR')} · {item.operatorName}
          </Text>

          <TouchableOpacity
            onPress={() => deleteApplication(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingState message="Carregando caderno de pulverização..." />;
  }

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
                {language === 'en' ? 'Spray Diary & MAPA Grace' : 'Caderno de Pulverização'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en' ? 'Pesticide tracking & safety intervals' : 'Intervalo de segurança e compliance MAPA'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              void triggerHaptic('light');
              setModalVisible(true);
            }}
            style={styles.addBtn}
            accessibilityLabel="Nova Aplicação"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>{inGraceCount}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Em Carência</Text>
            <Text style={styles.kpiSub}>Colheita restrita</Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#10B981' }]}>{safeCount}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Liberados</Text>
            <Text style={styles.kpiSub}>Sem resíduo ativo</Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#3B82F6' }]}>{applications.length}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>Aplicações</Text>
            <Text style={styles.kpiSub}>Safra atual</Text>
          </View>
        </View>

        <View style={[styles.sprayWindowBanner, isDark && styles.sprayWindowBannerDark]}>
          <MaterialCommunityIcons name="weather-windy" size={18} color="#059669" />
          <Text style={[styles.sprayWindowText, isDark && styles.sprayWindowTextDark]}>
            Janela de Pulverização Ideal: Vento 3 a 10 km/h · UR &gt; 55% · Temp &lt; 30°C
          </Text>
        </View>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="spray"
            title="Nenhuma Aplicação Registrada"
            description="Cadastre as pulverizações realizadas para controlar o período de carência de cada talhão."
          />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Registrar Pulverização</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#1E293B'} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Talhão / Lavoura</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={plantationName}
              onChangeText={setPlantationName}
              placeholder="Ex: Talhão 02 — Milho"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Produto Comercial</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Ex: Fox Xpro"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Alvo (Praga/Doença)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={targetPest}
                  onChangeText={setTargetPest}
                  placeholder="Ex: Ferrugem"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Dose por Hectare</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={dosePerHectare}
                  onChangeText={setDosePerHectare}
                  placeholder="Ex: 0.5 L/ha"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Carência (Dias)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={graceDays}
                  onChangeText={setGraceDays}
                  placeholder="Ex: 14"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Volume Calda (L/ha)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={sprayVolume}
                  onChangeText={setSprayVolume}
                  placeholder="120"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Área Total (ha)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={treatedArea}
                  onChangeText={setTreatedArea}
                  placeholder="30"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Ingrediente Ativo</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={activeIngredient}
              onChangeText={setActiveIngredient}
              placeholder="Ex: Trifloxistrobina + Protioconazol"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Ponta de Pulverização</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={nozzleType}
              onChangeText={setNozzleType}
              placeholder="Ex: Jato Plano Indução de Ar (AIXR)"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Vento (km/h)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={windKmH}
                  onChangeText={setWindKmH}
                  placeholder="6"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Temp (°C)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={tempC}
                  onChangeText={setTempC}
                  placeholder="24"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>UR (%)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={humidity}
                  onChangeText={setHumidity}
                  placeholder="65"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Operador / Pulverizador</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={operatorName}
              onChangeText={setOperatorName}
              placeholder="Ex: Carlos Mendes (Uniport 3030)"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Observações / Calda</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Adicionado adjuvante à calda..."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Gravar no Caderno de Campo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
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
  sprayWindowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sprayWindowBannerDark: {
    backgroundColor: '#064E3B33',
    borderColor: '#065F46',
  },
  sprayWindowText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    flex: 1,
  },
  sprayWindowTextDark: {
    color: '#34D399',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardSubtitleDark: {
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  graceBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  graceBadgeDark: {
    backgroundColor: '#450A0A55',
    borderColor: '#EF4444',
  },
  safeBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  safeBadgeDark: {
    backgroundColor: '#064E3B55',
    borderColor: '#10B981',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 6,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },
  infoValDark: {
    color: '#E2E8F0',
  },
  notesText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#059669',
  },
  notesTextDark: {
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  dateTextDark: {
    color: '#64748B',
  },
  deleteBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.base,
    maxHeight: '90%',
  },
  modalCardDark: {
    backgroundColor: '#121F17',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  formLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputCol: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#059669',
    height: 46,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
