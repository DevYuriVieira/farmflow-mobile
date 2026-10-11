import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTelemetry } from '../hooks/useTelemetry';
import { Screen } from '../../../components/Screen';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';

export const IrrigationSilosScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const { pivots, silos, togglePivot, toggleAeration } = useTelemetry();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
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
          <View>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Pivots & Silo Telemetry' : 'Telemetria de Pivôs & Silos'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'Automated smart farm telemetry 4.0' : 'Monitoramento remoto IoT e acionamentos'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Pivôs Centrais de Irrigação
        </Text>

        {pivots.map((p) => (
          <View key={p.id} style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{p.name}</Text>
                <Text style={styles.cardSub}>Posição: {p.angleDegrees}° · Vazão: {p.flowRateM3H} m³/h</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => togglePivot(p.id)}
                style={[
                  styles.powerBtn,
                  p.isRunning ? styles.powerBtnRunning : styles.powerBtnStopped,
                ]}
              >
                <MaterialCommunityIcons
                  name="power"
                  size={18}
                  color={p.isRunning ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.powerBtnText,
                    p.isRunning ? styles.powerBtnTextRunning : styles.powerBtnTextStopped,
                  ]}
                >
                  {p.isRunning ? 'Ligado' : 'Desligado'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metricsGrid}>
              <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                <Text style={styles.metricLabel}>Lâmina de Água</Text>
                <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{p.waterDepthMm} mm</Text>
              </View>
              <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                <Text style={styles.metricLabel}>Velocidade</Text>
                <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{p.speedPercent}%</Text>
              </View>
              <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                <Text style={styles.metricLabel}>Pressão do Pivô</Text>
                <Text
                  style={[
                    styles.metricVal,
                    { color: p.pressureBar >= 2.5 ? '#10B981' : '#F59E0B' },
                  ]}
                >
                  {p.pressureBar} bar
                </Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: spacing.md }, isDark && styles.sectionTitleDark]}>
          Armazenamento & Silos Graneleiros
        </Text>

        {silos.map((s) => {
          const fillRatio = Math.round((s.currentTons / s.capacityTons) * 100);

          return (
            <View key={s.id} style={[styles.card, isDark && styles.cardDark]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{s.name}</Text>
                  <Text style={styles.cardSub}>Grão: {s.grainType} · Capacidade: {s.capacityTons.toLocaleString()} t</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleAeration(s.id)}
                  style={[
                    styles.aerationBtn,
                    s.aerationActive && styles.aerationBtnActive,
                    isDark && !s.aerationActive && styles.aerationBtnDark,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fan"
                    size={16}
                    color={s.aerationActive ? '#FFFFFF' : '#059669'}
                  />
                  <Text style={[styles.aerationBtnText, s.aerationActive && styles.aerationBtnTextActive]}>
                    {s.aerationActive ? 'Aeração Ativa' : 'Aerar Silo'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.barWrap}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${fillRatio}%` }]} />
                </View>
                <View style={styles.barLabels}>
                  <Text style={[styles.barText, isDark && styles.barTextDark]}>
                    Ocupação: {s.currentTons.toLocaleString()} t ({fillRatio}%)
                  </Text>
                  <Text style={[styles.barText, isDark && styles.barTextDark]}>
                    Livre: {(s.capacityTons - s.currentTons).toLocaleString()} t
                  </Text>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                  <Text style={styles.metricLabel}>Temperatura da Massa</Text>
                  <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{s.temperatureCelsius}°C</Text>
                </View>
                <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                  <Text style={styles.metricLabel}>Umidade do Grão</Text>
                  <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{s.moisturePercent}%</Text>
                </View>
                <View style={[styles.metricCol, isDark && styles.metricColDark]}>
                  <Text style={styles.metricLabel}>Condição</Text>
                  <Text style={[styles.metricVal, { color: '#10B981' }]}>Ideal</Text>
                </View>
              </View>
            </View>
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
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  powerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  powerBtnRunning: {
    backgroundColor: '#10B981',
  },
  powerBtnStopped: {
    backgroundColor: '#F1F5F9',
  },
  powerBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  powerBtnTextRunning: {
    color: '#FFFFFF',
  },
  powerBtnTextStopped: {
    color: '#64748B',
  },
  aerationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  aerationBtnDark: {
    backgroundColor: '#162C21',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  aerationBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  aerationBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  aerationBtnTextActive: {
    color: '#FFFFFF',
  },
  barWrap: {
    marginVertical: spacing.xs,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barText: {
    fontSize: 11,
    color: '#64748B',
  },
  barTextDark: {
    color: '#94A3B8',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  metricCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricColDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  metricValDark: {
    color: '#FFFFFF',
  },
});
