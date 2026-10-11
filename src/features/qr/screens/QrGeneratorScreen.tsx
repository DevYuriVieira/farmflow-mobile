import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '../../../components/Screen';
import { Button } from '../../../components/Button';
import { AppDrawerParamList } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';

type RouteProps = RouteProp<AppDrawerParamList, 'QrGenerator'>;

export const QrGeneratorScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const { entityType, id, name } = route.params;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const payload = JSON.stringify({ type: entityType, id });

  const handleShareCode = async () => {
    try {
      await Share.share({
        title: `QR Code FarmFlow - ${name}`,
        message: `Código QR do ${entityType === 'farm' ? 'Fazenda' : 'Talhão'}: ${name}\nID: ${id}\nPayload: ${payload}`,
      });
    } catch {
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
          {language === 'en' ? 'QR Code Identifier' : 'Identificador QR'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.entityTypeBadge}>
            {entityType === 'farm' ? 'PROPRIEDADE RURAL' : 'TALHÃO AGRÍCOLA'}
          </Text>
          <Text style={styles.entityName}>{name}</Text>
          <Text style={styles.entityIdText}>Código: {id}</Text>

          <View style={styles.qrWrapper}>
            <QRCode
              value={payload}
              size={210}
              color="#07150E"
              backgroundColor="#FFFFFF"
            />
          </View>

          <Text style={styles.qrInstructions}>
            Imprima ou fixe este código nas placas do lote para identificação rápida via leitor mobile.
          </Text>

          <Button
            title="Compartilhar Identificador"
            onPress={handleShareCode}
            leftIcon={<MaterialCommunityIcons name="share-variant-outline" size={18} color={colors.textInverse} />}
            variant="primary"
            style={styles.shareBtn}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  qrCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  entityTypeBadge: {
    ...typography.micro,
    color: colors.accentLime,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  entityName: {
    ...typography.h3,
    color: '#172B23',
    textAlign: 'center',
    marginBottom: 2,
  },
  entityNameDark: {
    color: '#FFFFFF',
  },
  entityIdText: {
    ...typography.micro,
    color: '#64748B',
    marginBottom: spacing.lg,
  },
  entityIdTextDark: {
    color: '#CBD5E1',
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: spacing.base,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  qrInstructions: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  shareBtn: {
    width: '100%',
  },
});
