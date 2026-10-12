import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTelemetry } from '../hooks/useTelemetry';
import { Screen } from '../../../components/Screen';
import { styles } from '../styles/irrigationSilos.styles';
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

        <Text style={[styles.sectionTitleSpaced, isDark && styles.sectionTitleDark]}>
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

