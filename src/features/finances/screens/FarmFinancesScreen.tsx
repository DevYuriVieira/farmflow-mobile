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
import { calculateCropFinances } from '../cropFinanceFormulas';

export const FarmFinancesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const [crop, setCrop] = useState<'SOY' | 'CORN' | 'COFFEE'>('SOY');
  const [hectares, setHectares] = useState('120');
  const [expectedYieldBags, setExpectedYieldBags] = useState('68');
  const [bagMarketPrice, setBagMarketPrice] = useState('138');

  const [seedCost, setSeedCost] = useState('420');
  const [fertCost, setFertCost] = useState('1450');
  const [chemCost, setChemCost] = useState('850');
  const [fuelCost, setFuelCost] = useState('580');
  const [laborCost, setLaborCost] = useState('450');

  const result = calculateCropFinances({
    crop,
    hectares: parseFloat(hectares) || 120,
    expectedYieldBagsPerHa: parseFloat(expectedYieldBags) || 68,
    bagMarketPrice: parseFloat(bagMarketPrice) || 138,
    seedsCostPerHa: parseFloat(seedCost) || 420,
    fertilizersCostPerHa: parseFloat(fertCost) || 1450,
    chemicalsCostPerHa: parseFloat(chemCost) || 850,
    fuelAndMachineryCostPerHa: parseFloat(fuelCost) || 580,
    laborAndOperationsCostPerHa: parseFloat(laborCost) || 450,
  });

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
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
              {language === 'en' ? 'Crop Financials & Margin' : 'Gestão Financeira da Safra'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'Cost per hectare, break-even and ROI' : 'Custo por hectare, ponto de equilíbrio e margem'}
            </Text>
          </View>
        </View>

        <View style={styles.cropRow}>
          {(['SOY', 'CORN', 'COFFEE'] as const).map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => {
                void triggerHaptic('selection');
                setCrop(c);
                if (c === 'SOY') {
                  setExpectedYieldBags('68');
                  setBagMarketPrice('138');
                  setFertCost('1450');
                } else if (c === 'CORN') {
                  setExpectedYieldBags('135');
                  setBagMarketPrice('62');
                  setFertCost('1780');
                } else {
                  setExpectedYieldBags('38');
                  setBagMarketPrice('1280');
                  setFertCost('2800');
                }
              }}
              style={[
                styles.cropPill,
                crop === c && styles.cropPillActive,
                isDark && styles.cropPillDark,
              ]}
            >
              <Text style={[styles.cropPillText, crop === c && styles.cropPillTextActive]}>
                {c === 'SOY' ? 'Soja (sc 60kg)' : c === 'CORN' ? 'Milho (sc 60kg)' : 'Café (sc 60kg)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, isDark && styles.heroCardDark]}>
          <Text style={styles.heroLabel}>Lucro Líquido Projetado</Text>
          <Text style={styles.heroAmount}>
            R$ {result.totalNetProfit.toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.heroSubtext}>
            R$ {result.netProfitPerHectare.toLocaleString('pt-BR')} por hectare · ROI de {result.roiPercent}%
          </Text>

          <View style={styles.breakEvenBanner}>
            <MaterialCommunityIcons name="target" size={18} color="#059669" />
            <Text style={styles.breakEvenText}>
              Ponto de Equilíbrio (Break-Even): <Text style={{ fontWeight: '800' }}>{result.breakEvenBagsPerHa} sacas/ha</Text>
            </Text>
          </View>
        </View>

        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>Custo por Hectare</Text>
            <Text style={[styles.kpiValue, isDark && styles.kpiValueDark]}>
              R$ {result.costPerHectare.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>Investimento Total</Text>
            <Text style={[styles.kpiValue, isDark && styles.kpiValueDark]}>
              R$ {result.totalInvestment.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>Receita Bruta Esperada</Text>
            <Text style={[styles.kpiValue, { color: '#059669' }]}>
              R$ {result.totalGrossRevenue.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>Retorno sobre Custo</Text>
            <Text style={[styles.kpiValue, { color: result.roiPercent >= 0 ? '#10B981' : '#EF4444' }]}>
              +{result.roiPercent}%
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>Preço de Venda e Área</Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Área Total (ha)</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={hectares}
                onChangeText={setHectares}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Produtividade (sc/ha)</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={expectedYieldBags}
                onChangeText={setExpectedYieldBags}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Preço da Saca (R$)</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={bagMarketPrice}
                onChangeText={setBagMarketPrice}
              />
            </View>
          </View>

          <Text style={[styles.cardTitle, { marginTop: spacing.md }, isDark && styles.cardTitleDark]}>
            Composição de Custos Operacionais (R$/ha)
          </Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Sementes</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={seedCost}
                onChangeText={setSeedCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Fertilizantes</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={fertCost}
                onChangeText={setFertCost}
              />
            </View>
          </View>

          <View style={styles.inputGrid}>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Defensivos Químicos</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={chemCost}
                onChangeText={setChemCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Tratores & Diesel</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={fuelCost}
                onChangeText={setFuelCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>Mão de Obra</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={laborCost}
                onChangeText={setLaborCost}
              />
            </View>
          </View>
        </View>
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
  cropRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cropPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cropPillDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  cropPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  cropPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  cropPillTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  heroCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    alignItems: 'center',
  },
  heroCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 4,
  },
  heroSubtext: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
  },
  breakEvenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  breakEvenText: {
    fontSize: 12,
    color: '#065F46',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiCardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  kpiValueDark: {
    color: '#FFFFFF',
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
  cardTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 3,
  },
  inputLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
});
