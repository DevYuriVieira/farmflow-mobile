import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { usePlantations } from '../../plantations/hooks/usePlantations';
import { useFarms } from '../../farms/hooks/useFarms';
import { useToast } from '../../../contexts/ToastContext';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

import { Screen } from '../../../components/Screen';
import { Button } from '../../../components/Button';
import { AppNavigationProp } from '../../../navigation/types';
import { colors } from '../../../theme';
import { styles } from '../styles/qrScanner.styles';

export const QrScannerScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { data: plantations } = usePlantations();
  const { data: farms } = useFarms();
  const { showError, showSuccess } = useToast();

  const [manualCode, setManualCode] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const processQrPayload = (payload: string) => {
    if (!payload.trim()) return;
    if (lastScanned === payload) return;

    setLastScanned(payload);

    try {
      // 1. Try parsing JSON structured payload: {"type":"plantation","id":"plt-001"}
      let entityType: 'farm' | 'plantation' = 'plantation';
      let entityId = payload.trim();

      if (payload.startsWith('{') && payload.endsWith('}')) {
        const parsed = JSON.parse(payload) as { type?: string; id?: string };
        if (parsed.id) {
          entityId = parsed.id;
          if (parsed.type === 'farm') entityType = 'farm';
        }
      } else if (entityId.startsWith('farm-')) {
        entityType = 'farm';
      }

      if (entityType === 'farm') {
        const farm = farms?.find((f) => f.id === entityId);
        if (farm) {
          void triggerHaptic('success');
          showSuccess(language === 'en' ? `Farm "${farm.name}" found!` : `Fazenda "${farm.name}" identificada!`);
          navigation.navigate('FarmDetail', { farmId: farm.id });
          return;
        }
      } else {
        const plantation = plantations?.find((p) => p.id === entityId);
        if (plantation) {
          void triggerHaptic('success');
          showSuccess(language === 'en' ? `Field "${plantation.name}" found!` : `Talhão "${plantation.name}" identificado!`);
          navigation.navigate('PlantationDetail', { plantationId: plantation.id });
          return;
        }
      }

      void triggerHaptic('error');
      Alert.alert(
        language === 'en' ? 'Batch Not Found' : 'Lote Não Encontrado',
        language === 'en'
          ? `No registered farm or field matches ID: "${entityId}".`
          : `Nenhuma propriedade ou talhão cadastrado corresponde ao identificador: "${entityId}".`,
        [{ text: 'OK' }]
      );
    } catch {
      void triggerHaptic('error');
      showError(language === 'en' ? 'Invalid QR code.' : 'Código QR inválido ou ilegível.');
    }
  };

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {language === 'en' ? 'QR Code Scanner' : 'Leitor de QR Code'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.viewfinderContainer}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          <View style={styles.scanLaser} />

          <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.primaryLight} opacity={0.6} />
          <Text style={styles.viewfinderHelp}>
            Aponte a câmera para a placa do talhão ou insira o código abaixo
          </Text>
        </View>

        <View style={styles.quickTestBox}>
          <Text style={styles.quickTestTitle}>Simulação de Leitura de Lotes:</Text>
          <View style={styles.quickButtonsRow}>
            {plantations?.slice(0, 3).map((plt) => (
              <TouchableOpacity
                key={plt.id}
                onPress={() => processQrPayload(plt.id)}
                style={styles.quickChip}
              >
                <Text style={styles.quickChipText} numberOfLines={1}>
                  {plt.name.split('-')[0].trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.manualCard}>
          <Text style={styles.manualLabel}>Digitar Código do Talhão ou Fazenda:</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ex: plt-001 ou farm-001"
              placeholderTextColor={colors.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
              style={styles.input}
              autoCapitalize="none"
            />
            <Button
              title="Buscar"
              onPress={() => processQrPayload(manualCode)}
              size="sm"
              variant="primary"
              style={styles.searchBtn}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

