import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

import { Screen } from '../../../components/Screen';
import { Button } from '../../../components/Button';
import { AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';

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
          showSuccess(language === 'en' ? `Farm "${farm.name}" found!` : `Fazenda "${farm.name}" identificada!`);
          navigation.navigate('FarmDetail', { farmId: farm.id });
          return;
        }
      } else {
        const plantation = plantations?.find((p) => p.id === entityId);
        if (plantation) {
          showSuccess(language === 'en' ? `Field "${plantation.name}" found!` : `Talhão "${plantation.name}" identificado!`);
          navigation.navigate('PlantationDetail', { plantationId: plantation.id });
          return;
        }
      }

      Alert.alert(
        language === 'en' ? 'Batch Not Found' : 'Lote Não Encontrado',
        language === 'en'
          ? `No registered farm or field matches ID: "${entityId}".`
          : `Nenhuma propriedade ou talhão cadastrado corresponde ao identificador: "${entityId}".`,
        [{ text: 'OK' }]
      );
    } catch {
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: spacing.md,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderContainer: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(12, 30, 21, 0.7)',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.xl,
  },
  cornerTL: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  scanLaser: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewfinderHelp: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 200,
    marginTop: spacing.md,
  },
  quickTestBox: {
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  quickTestTitle: {
    ...typography.micro,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickChip: {
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipText: {
    ...typography.micro,
    color: colors.primaryLight,
  },
  manualCard: {
    width: '100%',
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  manualLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    marginRight: spacing.sm,
    ...typography.body,
  },
  searchBtn: {
    minWidth: 90,
  },
});
