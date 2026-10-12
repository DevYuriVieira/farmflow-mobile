import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { CommodityQuote } from '../types';
import { marketService, INITIAL_QUOTES, getCommodityName, getCommodityUnit } from '../services/marketService';
import { Screen } from '../../../components/Screen';
import { styles } from '../styles/marketCommodities.styles';
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
            <Text style={styles.simTitle}>
              {language === 'en' ? 'Crop Harvest Sales Simulator' : 'Simulador de Venda de Safra'}
            </Text>
          </View>

          <View style={styles.simInputsRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.simInputLabel, isDark && styles.simInputLabelDark]}>
                {language === 'en' ? 'Quantity' : 'Quantidade'} ({getCommodityUnit(selectedCommodity.id, selectedCommodity.unit, language)})
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
                  {getCommodityName(selectedCommodity.id, selectedCommodity.name, language)} (R$ {selectedCommodity.priceBrl.toFixed(2)})
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.simResultBox}>
            <Text style={styles.simResultLabel}>
              {language === 'en' ? 'Estimated Total Gross Value:' : 'Valor Bruto Total Estimado:'}
            </Text>
            <Text style={styles.simResultValue}>R$ {totalLotValue.toLocaleString('pt-BR')}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {language === 'en' ? 'Agricultural Market Indicators' : 'Indicadores do Mercado Agrícola'}
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
                  <Text style={[styles.quoteName, isDark && styles.quoteNameDark]}>
                    {getCommodityName(item.id, item.name, language)}
                  </Text>
                  <Text style={styles.quoteRef}>
                    {item.marketReference} · {getCommodityUnit(item.id, item.unit, language)}
                  </Text>
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
                  <Text style={styles.rangeText}>{language === 'en' ? 'Min' : 'Mín'}: R$ {item.lowBrl.toFixed(1)}</Text>
                  <Text style={styles.rangeText}>·</Text>
                  <Text style={styles.rangeText}>{language === 'en' ? 'Max' : 'Máx'}: R$ {item.highBrl.toFixed(1)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Screen>
  );
};

