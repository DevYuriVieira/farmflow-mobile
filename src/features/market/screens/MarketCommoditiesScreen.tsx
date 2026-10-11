import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { CommodityQuote } from '../types';
import { marketService, INITIAL_QUOTES } from '../services/marketService';
import { Screen } from '../../../components/Screen';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const MarketCommoditiesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();

  const [quotes, setQuotes] = useState<CommodityQuote[]>(INITIAL_QUOTES);
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityQuote>(INITIAL_QUOTES[0]);
  const [bagsQuantity, setBagsQuantity] = useState('3000');
  const [dollarRate, setDollarRate] = useState(5.62);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  useEffect(() => {
    void (async () => {
      const summary = await marketService.getMarketSummary();
      setQuotes(summary.quotes);
      setDollarRate(summary.dollarCommercialBrl);
    })();
  }, []);

  const totalLotValue = marketService.calculateGrossLotValue(
    parseFloat(bagsQuantity) || 0,
    selectedCommodity.priceBrl
  );

  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    return points
      .map((p, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

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
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Commodity Markets' : 'Cotações Agro ao Vivo'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'B3, Cepea & Chicago prices' : 'Preços spot Cepea, B3 e mercado físico'}
            </Text>
          </View>

          <View style={[styles.dollarPill, isDark && styles.dollarPillDark]}>
            <Text style={styles.dollarLabel}>USD/BRL</Text>
            <Text style={styles.dollarVal}>R$ {dollarRate.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.simCard, isDark && styles.simCardDark]}>
          <View style={styles.simHeader}>
            <MaterialCommunityIcons name="calculator" size={18} color="#059669" />
            <Text style={styles.simTitle}>Simulador de Venda de Safra</Text>
          </View>

          <View style={styles.simInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.simInputLabel, isDark && styles.simInputLabelDark]}>
                Quantidade ({selectedCommodity.unit})
              </Text>
              <TextInput
                style={[styles.simInput, isDark && styles.simInputDark]}
                keyboardType="numeric"
                value={bagsQuantity}
                onChangeText={setBagsQuantity}
              />
            </View>
            <View style={{ flex: 1.2 }}>
              <Text style={[styles.simInputLabel, isDark && styles.simInputLabelDark]}>Commodity</Text>
              <View style={[styles.simCommodityPill, isDark && styles.simCommodityPillDark]}>
                <Text style={[styles.simCommodityText, isDark && styles.simCommodityTextDark]}>
                  {selectedCommodity.name} (R$ {selectedCommodity.priceBrl.toFixed(2)})
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.simResultBox}>
            <Text style={styles.simResultLabel}>Valor Bruto Total Estimado:</Text>
            <Text style={styles.simResultValue}>R$ {totalLotValue.toLocaleString('pt-BR')}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Indicadores do Mercado Agrícola
        </Text>

        {quotes.map((item) => {
          const isPositive = item.dailyChangePercent >= 0;
          const isSelected = selectedCommodity.id === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => {
                void triggerHaptic('selection');
                setSelectedCommodity(item);
              }}
              style={[
                styles.quoteCard,
                isDark && styles.quoteCardDark,
                isSelected && styles.quoteCardSelected,
                isSelected && isDark && styles.quoteCardSelectedDark,
              ]}
            >
              <View style={styles.quoteRowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quoteName, isDark && styles.quoteNameDark]}>{item.name}</Text>
                  <Text style={styles.quoteRef}>{item.marketReference} · {item.unit}</Text>
                </View>

                <View style={styles.sparklineWrap}>
                  <Svg width="80" height="28" viewBox="0 0 80 28">
                    <Path
                      d={generateSparklinePath(item.weeklyTrend)}
                      fill="none"
                      stroke={isPositive ? '#10B981' : '#EF4444'}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>

                <View
                  style={[
                    styles.changeBadge,
                    { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isPositive ? 'arrow-up-bold' : 'arrow-down-bold'}
                    size={12}
                    color={isPositive ? '#059669' : '#DC2626'}
                  />
                  <Text
                    style={[
                      styles.changeBadgeText,
                      { color: isPositive ? '#059669' : '#DC2626' },
                    ]}
                  >
                    {isPositive ? `+${item.dailyChangePercent}%` : `${item.dailyChangePercent}%`}
                  </Text>
                </View>
              </View>

              <View style={styles.quoteRowBottom}>
                <View>
                  <Text style={[styles.priceBig, isDark && styles.priceBigDark]}>
                    R$ {item.priceBrl.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.rangeRow}>
                  <Text style={styles.rangeText}>Mín: R$ {item.lowBrl.toFixed(1)}</Text>
                  <Text style={styles.rangeText}>·</Text>
                  <Text style={styles.rangeText}>Máx: R$ {item.highBrl.toFixed(1)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: spacing.xs,
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
  dollarPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  dollarPillDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  dollarLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  dollarVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  simCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
  },
  simCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  simTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  simInputsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  simInputLabel: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginBottom: 3,
  },
  simInputLabelDark: {
    color: '#86EFAC',
  },
  simInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
  },
  simInputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  simCommodityPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.lg,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  simCommodityPillDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  simCommodityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  simCommodityTextDark: {
    color: '#86EFAC',
  },
  simResultBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii.lg,
    padding: 10,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  simResultLabel: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  simResultValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  quoteCardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  quoteCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  quoteCardSelectedDark: {
    borderColor: '#10B981',
    backgroundColor: '#162C21',
  },
  quoteRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quoteName: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  quoteNameDark: {
    color: '#FFFFFF',
  },
  quoteRef: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sparklineWrap: {
    marginHorizontal: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  changeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quoteRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    paddingTop: spacing.xs + 2,
  },
  priceBig: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  priceBigDark: {
    color: '#FFFFFF',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 11,
    color: '#64748B',
  },
});
