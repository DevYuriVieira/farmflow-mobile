import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '../../../components/Screen';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';
import {
  calculateSpray,
  calculateNpk,
  estimateYield,
} from '../agronomyFormulas';

type CalcTab = 'spray' | 'npk' | 'yield';

export const CalculatorsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const [activeTab, setActiveTab] = useState<CalcTab>('spray');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const [targetRate, setTargetRate] = useState('150');
  const [tankCapacity, setTankCapacity] = useState('2000');
  const [boomWidth, setBoomWidth] = useState('24');
  const [tractorSpeed, setTractorSpeed] = useState('18');
  const [nozzleSpacing, setNozzleSpacing] = useState('0.5');

  const [selectedCrop, setSelectedCrop] = useState<'SOY' | 'CORN' | 'COFFEE'>('SOY');
  const [targetYield, setTargetYield] = useState('4.5');
  const [soilP, setSoilP] = useState('10');
  const [soilK, setSoilK] = useState('0.12');

  const [yieldCrop, setYieldCrop] = useState<'SOY' | 'CORN'>('SOY');
  const [rowSpacing, setRowSpacing] = useState('0.5');
  const [plantsPerMeter, setPlantsPerMeter] = useState('12');
  const [earsOrPods, setEarsOrPods] = useState('32');
  const [grainsPerUnit, setGrainsPerUnit] = useState('2.4');
  const [thousandGrainWeight, setThousandGrainWeight] = useState('165');

  const sprayResult = calculateSpray({
    targetRateLPerHa: parseFloat(targetRate) || 150,
    tankCapacityL: parseFloat(tankCapacity) || 2000,
    boomWidthMeters: parseFloat(boomWidth) || 24,
    tractorSpeedKmH: parseFloat(tractorSpeed) || 18,
    nozzleSpacingMeters: parseFloat(nozzleSpacing) || 0.5,
  });

  const npkResult = calculateNpk({
    crop: selectedCrop,
    targetYieldTonPerHa: parseFloat(targetYield) || 4.5,
    soilP_mgDm3: parseFloat(soilP) || 10,
    soilK_cmolcDm3: parseFloat(soilK) || 0.12,
  });

  const yieldResult = estimateYield({
    crop: yieldCrop,
    rowSpacingMeters: parseFloat(rowSpacing) || 0.5,
    plantsPerLinearMeter: parseFloat(plantsPerMeter) || 12,
    earsOrPodsPerPlant: parseFloat(earsOrPods) || 32,
    grainsPerEarOrPod: parseFloat(grainsPerUnit) || 2.4,
    thousandGrainWeightGrams: parseFloat(thousandGrainWeight) || 165,
  });

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[styles.backBtn, isDark && styles.backBtnDark]}
            accessibilityLabel={language === 'en' ? 'Back' : 'Voltar'}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Agronomic Calculators' : 'Calculadoras Agronômicas'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'Calibrations and crop yield forecasts' : 'Calibrações de campo e estimativas de safra'}
            </Text>
          </View>
        </View>

        <View style={[styles.tabsRow, isDark && styles.tabsRowDark]}>
          {[
            { id: 'spray', label: language === 'en' ? 'Spray Rate' : 'Pulverização', icon: 'water-outline' },
            { id: 'npk', label: language === 'en' ? 'NPK Fertilizer' : 'Adubação NPK', icon: 'sprout-outline' },
            { id: 'yield', label: language === 'en' ? 'Bags / Ha' : 'Sacas / ha', icon: 'chart-line' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.8}
                onPress={() => {
                  void triggerHaptic('selection');
                  setActiveTab(tab.id as CalcTab);
                }}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              >
                <MaterialCommunityIcons
                  name={tab.icon as any}
                  size={16}
                  color={isSelected ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
                />
                <Text style={[styles.tabText, isSelected && styles.tabTextActive, isDark && !isSelected && { color: '#CBD5E1' }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'spray' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                {language === 'en' ? 'Application Calibration' : 'Parâmetros do Pulverizador'}
              </Text>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Taxa (L/ha)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={targetRate}
                    onChangeText={setTargetRate}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Tanque (L)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={tankCapacity}
                    onChangeText={setTankCapacity}
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Barra (m)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={boomWidth}
                    onChangeText={setBoomWidth}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Velocidade (km/h)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={tractorSpeed}
                    onChangeText={setTractorSpeed}
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Espaçamento Bicos (m)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={nozzleSpacing}
                    onChangeText={setNozzleSpacing}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                <Text style={styles.resultHeaderTitle}>
                  {language === 'en' ? 'Calculated Results' : 'Resultado da Calibração'}
                </Text>
              </View>

              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Vazão por Bico</Text>
                  <Text style={styles.resultItemValue}>{sprayResult.nozzleFlowRateLPerMin} L/min</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Área por Tanque</Text>
                  <Text style={styles.resultItemValue}>{sprayResult.hectaresPerTank} ha</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Total de Bicos</Text>
                  <Text style={styles.resultItemValue}>{sprayResult.numberOfNozzles} un</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Vazão da Barra</Text>
                  <Text style={styles.resultItemValue}>{sprayResult.totalFlowRateLPerMin} L/min</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'npk' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                Cultura e Análise de Solo
              </Text>

              <View style={styles.chipRow}>
                {(['SOY', 'CORN', 'COFFEE'] as const).map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => {
                      void triggerHaptic('selection');
                      setSelectedCrop(crop);
                      if (crop === 'SOY') setTargetYield('4.5');
                      else if (crop === 'CORN') setTargetYield('10');
                      else setTargetYield('35');
                    }}
                    style={[
                      styles.cropChip,
                      selectedCrop === crop && styles.cropChipActive,
                      isDark && styles.cropChipDark,
                    ]}
                  >
                    <Text style={[styles.cropChipText, selectedCrop === crop && styles.cropChipTextActive]}>
                      {crop === 'SOY' ? 'Soja' : crop === 'CORN' ? 'Milho' : 'Café'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Meta (t/ha)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={targetYield}
                    onChangeText={setTargetYield}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>P Solo (mg/dm³)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={soilP}
                    onChangeText={setSoilP}
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>K Solo (cmolc/dm³)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={soilK}
                    onChangeText={setSoilK}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons name="sprout" size={20} color="#10B981" />
                <Text style={styles.resultHeaderTitle}>Recomendação Nutricional</Text>
              </View>

              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Nitrogênio (N)</Text>
                  <Text style={styles.resultItemValue}>{npkResult.nitrogenKgPerHa} kg/ha</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Fósforo (P₂O₅)</Text>
                  <Text style={styles.resultItemValue}>{npkResult.phosphorusKgPerHa} kg/ha</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Potássio (K₂O)</Text>
                  <Text style={styles.resultItemValue}>{npkResult.potassiumKgPerHa} kg/ha</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Calagem Estimada</Text>
                  <Text style={styles.resultItemValue}>{npkResult.limingRecommendedTonHa} t/ha</Text>
                </View>
              </View>

              <View style={styles.formulaBox}>
                <Text style={styles.formulaLabel}>Sugestão Comercial:</Text>
                <Text style={styles.formulaValue}>{npkResult.commercialFormulaSuggested}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'yield' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, isDark && styles.cardDark]}>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                Estande de Plantas e Amostragem
              </Text>

              <View style={styles.chipRow}>
                {(['SOY', 'CORN'] as const).map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => {
                      void triggerHaptic('selection');
                      setYieldCrop(crop);
                      if (crop === 'SOY') {
                        setPlantsPerMeter('12');
                        setEarsOrPods('32');
                        setGrainsPerUnit('2.4');
                        setThousandGrainWeight('165');
                      } else {
                        setPlantsPerMeter('3.6');
                        setEarsOrPods('1');
                        setGrainsPerUnit('560');
                        setThousandGrainWeight('330');
                      }
                    }}
                    style={[
                      styles.cropChip,
                      yieldCrop === crop && styles.cropChipActive,
                      isDark && styles.cropChipDark,
                    ]}
                  >
                    <Text style={[styles.cropChipText, yieldCrop === crop && styles.cropChipTextActive]}>
                      {crop === 'SOY' ? 'Soja (Vagens)' : 'Milho (Espigas)'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Espaçamento Linhas (m)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={rowSpacing}
                    onChangeText={setRowSpacing}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Plantas / Metro</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={plantsPerMeter}
                    onChangeText={setPlantsPerMeter}
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                    {yieldCrop === 'SOY' ? 'Vagens / Planta' : 'Espigas / Planta'}
                  </Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={earsOrPods}
                    onChangeText={setEarsOrPods}
                  />
                </View>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                    {yieldCrop === 'SOY' ? 'Grãos / Vagem' : 'Grãos / Espiga'}
                  </Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={grainsPerUnit}
                    onChangeText={setGrainsPerUnit}
                  />
                </View>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputCol}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Peso 1000 Grãos (PMG em g)</Text>
                  <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    keyboardType="numeric"
                    value={thousandGrainWeight}
                    onChangeText={setThousandGrainWeight}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons name="scale" size={20} color="#10B981" />
                <Text style={styles.resultHeaderTitle}>Estimativa de Colheita</Text>
              </View>

              <View style={styles.highlightYield}>
                <Text style={styles.highlightYieldNumber}>{yieldResult.estimatedBagsPerHa}</Text>
                <Text style={styles.highlightYieldUnit}>Sacas (60kg) por hectare</Text>
                <View style={styles.benchmarkPill}>
                  <Text style={styles.benchmarkText}>Classificação: {yieldResult.benchmarkRating}</Text>
                </View>
              </View>

              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>População Total</Text>
                  <Text style={styles.resultItemValue}>{yieldResult.plantPopulationPerHa.toLocaleString()} pl/ha</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemLabel}>Produção Total</Text>
                  <Text style={styles.resultItemValue}>{yieldResult.estimatedKgPerHa.toLocaleString()} kg/ha</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
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
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  title: {
    ...typography.h2,
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.micro,
    color: '#64748B',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    padding: 4,
    gap: 4,
  },
  tabsRowDark: {
    backgroundColor: '#122018',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.lg,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: spacing.base,
  },
  tabContent: {
    gap: spacing.base,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  cropChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cropChipDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  cropChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  cropChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  inputLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  resultCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  resultHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065F46',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultItem: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.2)',
  },
  resultItemLabel: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultItemValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 2,
  },
  formulaBox: {
    marginTop: spacing.md,
    padding: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: radii.md,
  },
  formulaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
  },
  formulaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 2,
  },
  highlightYield: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  highlightYieldNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#059669',
  },
  highlightYieldUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  benchmarkPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: '#DCFCE7',
  },
  benchmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
