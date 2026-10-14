import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '../../../components/Screen';
import { styles } from '../styles/farmFinances.styles';
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
    <Screen scrollable>
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
                {c === 'SOY'
                  ? (language === 'en' ? 'Soybeans (60kg bag)' : 'Soja (sc 60kg)')
                  : c === 'CORN'
                  ? (language === 'en' ? 'Corn (60kg bag)' : 'Milho (sc 60kg)')
                  : (language === 'en' ? 'Coffee (60kg bag)' : 'Café (sc 60kg)')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, isDark && styles.heroCardDark]}>
          <Text style={styles.heroLabel}>
            {language === 'en' ? 'Projected Net Profit' : 'Lucro Líquido Projetado'}
          </Text>
          <Text style={styles.heroAmount}>
            R$ {result.totalNetProfit.toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.heroSubtext}>
            R$ {result.netProfitPerHectare.toLocaleString('pt-BR')}{' '}
            {language === 'en' ? 'per hectare · ROI of' : 'por hectare · ROI de'} {result.roiPercent}%
          </Text>

          <View style={styles.breakEvenBanner}>
            <MaterialCommunityIcons name="target" size={18} color="#059669" />
            <Text style={styles.breakEvenText}>
              {language === 'en' ? 'Break-Even Point:' : 'Ponto de Equilíbrio (Break-Even):'}{' '}
              <Text style={{ fontWeight: '800' }}>
                {result.breakEvenBagsPerHa} {language === 'en' ? 'bags/ha' : 'sacas/ha'}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>
              {language === 'en' ? 'Cost per Hectare' : 'Custo por Hectare'}
            </Text>
            <Text style={[styles.kpiValue, isDark && styles.kpiValueDark]}>
              R$ {result.costPerHectare.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>
              {language === 'en' ? 'Total Investment' : 'Investimento Total'}
            </Text>
            <Text style={[styles.kpiValue, isDark && styles.kpiValueDark]}>
              R$ {result.totalInvestment.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>
              {language === 'en' ? 'Expected Gross Revenue' : 'Receita Bruta Esperada'}
            </Text>
            <Text style={[styles.kpiValue, { color: '#059669' }]}>
              R$ {result.totalGrossRevenue.toLocaleString('pt-BR')}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={styles.kpiLabel}>
              {language === 'en' ? 'Return on Cost' : 'Retorno sobre Custo'}
            </Text>
            <Text style={[styles.kpiValue, { color: result.roiPercent >= 0 ? '#10B981' : '#EF4444' }]}>
              +{result.roiPercent}%
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            {language === 'en' ? 'Sale Price & Area' : 'Preço de Venda e Área'}
          </Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Total Area (ha)' : 'Área Total (ha)'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={hectares}
                onChangeText={setHectares}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Yield (bags/ha)' : 'Produtividade (sc/ha)'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={expectedYieldBags}
                onChangeText={setExpectedYieldBags}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Bag Price (R$)' : 'Preço da Saca (R$)'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={bagMarketPrice}
                onChangeText={setBagMarketPrice}
              />
            </View>
          </View>

          <Text style={[styles.cardTitleSpaced, isDark && styles.cardTitleDark]}>
            {language === 'en' ? 'Operating Costs Breakdown (R$/ha)' : 'Composição de Custos Operacionais (R$/ha)'}
          </Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Seeds' : 'Sementes'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={seedCost}
                onChangeText={setSeedCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Fertilizers' : 'Fertilizantes'}
              </Text>
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
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Chemical Crop Protection' : 'Defensivos Químicos'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={chemCost}
                onChangeText={setChemCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Machinery & Fuel' : 'Tratores & Diesel'}
              </Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                keyboardType="numeric"
                value={fuelCost}
                onChangeText={setFuelCost}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Labor & Operations' : 'Mão de Obra'}
              </Text>
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

