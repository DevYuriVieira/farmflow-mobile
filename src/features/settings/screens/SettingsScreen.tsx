import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '../../../contexts/AuthContext';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useFarms } from '../../farms/hooks/useFarms';
import { mockDb } from '../../../mocks/database';
import { useToast } from '../../../contexts/ToastContext';
import { AppNavigationProp } from '../../../navigation/types';

import { Screen } from '../../../components/Screen';
import { Button } from '../../../components/Button';
import { UserAvatar } from '../../../components/UserAvatar';
import { colors, radii, spacing, typography } from '../../../theme';
import { checkBiometricSupport, authenticateWithBiometrics } from '../../../services/security/biometrics.service';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { user, signOut } = useAuth();
  const {
    preferences,
    selectedFarmId,
    isDark,
    highContrastFieldMode,
    language,
    setSelectedFarmId,
    toggleReducedMotion,
    toggleNotifications,
    toggleTheme,
    toggleHighContrastFieldMode,
    setLanguage,
  } = usePreferences();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { data: farms } = useFarms();
  const { showSuccess } = useToast();

  const handleTestBiometrics = async () => {
    const status = await checkBiometricSupport();
    if (!status.hasHardware) {
      Alert.alert(
        'Biometria',
        'Hardware biométrico não detectado no dispositivo/navegador. (Emulando em ambiente web/teste)'
      );
      return;
    }
    const result = await authenticateWithBiometrics('Validação Biométrica FarmFlow');
    if (result.success) {
      showSuccess('Biometria autenticada com sucesso!');
    } else {
      Alert.alert('Falha na Biometria', result.error || 'Autenticação não concluída.');
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      language === 'en' ? 'Restore Demo Data' : 'Restaurar Dados de Demonstração',
      language === 'en'
        ? 'Do you want to reset farms, crops, and activities to default factory data?'
        : 'Deseja restaurar as fazendas, talhões e atividades para o conjunto de dados original de fábrica?',
      [
        { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel' },
        {
          text: language === 'en' ? 'Restore' : 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await mockDb.resetToDefaults();
            showSuccess(language === 'en' ? 'Demo database reset to default!' : 'Banco de demonstração restaurado para o padrão!');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      language === 'en' ? 'Log Out' : 'Sair da Conta',
      language === 'en' ? 'Do you really want to sign out of FarmFlow?' : 'Deseja realmente encerrar sua sessão no FarmFlow?',
      [
        { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel' },
        {
          text: language === 'en' ? 'Log Out' : 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[styles.backBtn, isDark && styles.backBtnDark]}
            accessibilityLabel="Voltar"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color={isDark ? '#FFFFFF' : '#1E293B'}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Settings' : 'Configurações'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'Account and device preferences' : 'Preferências da conta e do dispositivo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          <UserAvatar size={56} showBadge />
          <View style={styles.profileTextWrapper}>
            <Text style={[styles.profileName, isDark && styles.profileNameDark]}>
              {user?.name || (language === 'en' ? 'Guest Farmer' : 'Produtor Rural')}
            </Text>
            <Text style={[styles.profileEmail, isDark && styles.profileEmailDark]}>
              {user?.email || 'demo@farmflow.ag'}
            </Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>
                {language === 'en' ? 'Verified Account · Green Valley' : 'Acesso Verificado · Santa Fé'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'Theme & Language' : 'Tema e Idioma'}
          </Text>

          <View style={[styles.settingRow, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons
                  name={isDark ? 'weather-night' : 'weather-sunny'}
                  size={20}
                  color={isDark ? '#FACC15' : colors.primary}
                />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Night Mode' : 'Modo Noturno'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Dark interface for comfortable field viewing at night'
                  : 'Tema escuro e suave para visualização noturna no campo'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: isDark ? '#23382E' : colors.surfaceInput, true: '#22C55E' }}
              thumbColor={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </View>

          <View style={[styles.settingRow, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons
                  name="tractor"
                  size={20}
                  color={highContrastFieldMode ? '#FACC15' : colors.primary}
                />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Tractor Field Mode (Anti-Glare)' : 'Modo Cabine (Alto Contraste Solar)'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'High-contrast black & amber theme with enlarged buttons for outdoor machinery'
                  : 'Fundo preto puro e botões ampliados anti-reflexo para operação na lavoura'}
              </Text>
            </View>
            <Switch
              value={highContrastFieldMode}
              onValueChange={toggleHighContrastFieldMode}
              trackColor={{ false: isDark ? '#23382E' : colors.surfaceInput, true: '#FACC15' }}
              thumbColor={highContrastFieldMode ? '#000000' : colors.textPrimary}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons
                  name="translate"
                  size={20}
                  color={isDark ? '#4ADE80' : colors.primary}
                />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Language' : 'Idioma'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en' ? 'Select English or Portuguese' : 'Selecione Português ou Inglês'}
              </Text>
            </View>
            <View style={[styles.langSegment, isDark && styles.langSegmentDark]}>
              <TouchableOpacity
                onPress={() => setLanguage('pt')}
                style={[
                  styles.langSegmentBtn,
                  language === 'pt' && (isDark ? styles.langSegmentBtnActiveDark : styles.langSegmentBtnActive),
                ]}
              >
                <Text
                  style={[
                    styles.langSegmentText,
                    language === 'pt' && styles.langSegmentTextActive,
                    isDark && language !== 'pt' && styles.langSegmentTextDark,
                  ]}
                >
                  🇧🇷 PT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage('en')}
                style={[
                  styles.langSegmentBtn,
                  language === 'en' && (isDark ? styles.langSegmentBtnActiveDark : styles.langSegmentBtnActive),
                ]}
              >
                <Text
                  style={[
                    styles.langSegmentText,
                    language === 'en' && styles.langSegmentTextActive,
                    isDark && language !== 'en' && styles.langSegmentTextDark,
                  ]}
                >
                  🇺🇸 EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'Security & Native Biometrics' : 'Segurança & Biometria Nativa'}
          </Text>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={20}
                  color="#22C55E"
                />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Biometric Authentication' : 'Face ID / Biometria'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Hardware-level biometric verification and SecureStore encrypted keychain'
                  : 'Validação biométrica com criptografia no SecureStore para acesso rápido no campo'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleTestBiometrics}
              style={{
                backgroundColor: '#22C55E',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                {language === 'en' ? 'Test' : 'Testar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'Selected Default Farm' : 'Fazenda Padrão Selecionada'}
          </Text>
          <View style={styles.farmsList}>
            {farms?.map((farm) => {
              const isSelected =
                selectedFarmId === farm.id || (!selectedFarmId && farms?.[0]?.id === farm.id);
              return (
                <TouchableOpacity
                  key={farm.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFarmId(farm.id)}
                  style={[
                    styles.farmItem,
                    isSelected && (isDark ? styles.farmItemActiveDark : styles.farmItemActive),
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isSelected ? 'check-circle' : 'circle-outline'}
                    size={20}
                    color={isSelected ? '#22C55E' : isDark ? '#4B6355' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.farmItemText,
                      isSelected && styles.farmItemTextActive,
                      isDark && !isSelected && styles.farmItemTextDark,
                    ]}
                  >
                    {farm.name} ({farm.location})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'App Preferences' : 'Preferências do Aplicativo'}
          </Text>

          <View style={[styles.settingRow, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                {language === 'en' ? 'Reduce Animations' : 'Reduzir Animações'}
              </Text>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Pauses ambient loops to preserve battery life'
                  : 'Pausa animações contínuas de nuvens e névoa para economizar bateria'}
              </Text>
            </View>
            <Switch
              value={preferences.reducedMotion}
              onValueChange={toggleReducedMotion}
              trackColor={{ false: isDark ? '#23382E' : colors.surfaceInput, true: '#22C55E' }}
              thumbColor={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                {language === 'en' ? 'Notifications & Alerts' : 'Notificações e Lembretes'}
              </Text>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Receive alerts about scheduled irrigation and harvest'
                  : 'Receba alertas sonoros sobre manejos e irrigações agendados'}
              </Text>
            </View>
            <Switch
              value={preferences.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: isDark ? '#23382E' : colors.surfaceInput, true: '#22C55E' }}
              thumbColor={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'Connectivity Status' : 'Status de Conectividade'}
          </Text>
          <View style={styles.networkStatusRow}>
            <View style={styles.networkIndicator}>
              <View
                style={[
                  styles.networkDot,
                  { backgroundColor: isConnected ? colors.success : colors.danger },
                ]}
              />
              <Text style={[styles.networkStatusText, isDark && styles.networkStatusTextDark]}>
                {isConnected
                  ? language === 'en' ? 'Connected (Online)' : 'Conectado (Online)'
                  : language === 'en' ? 'Offline (Local Sync)' : 'Modo Offline (Sincronização Local)'}
              </Text>
            </View>
            <Text style={[styles.networkSubtext, isDark && styles.networkSubtextDark]}>
              {isInternetReachable
                ? language === 'en' ? 'Cloud database in sync' : 'Sincronizado com nuvem'
                : language === 'en' ? 'Pending queue storage' : 'Filas locais seguras'}
            </Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Button
            title={language === 'en' ? 'Reset Demo Database' : 'Restaurar Dados de Fábrica'}
            variant="outline"
            onPress={handleResetData}
            style={styles.actionButton}
          />
          <Button
            title={language === 'en' ? 'Log Out' : 'Sair da Conta'}
            variant="danger"
            onPress={handleLogout}
            style={styles.actionButton}
          />
        </View>

        <Text style={[styles.versionText, isDark && styles.versionTextDark]}>
          FarmFlow v1.0.0 · SDK 54 · Offline-First Engine
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  headerTopRow: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  titleDark: {
    color: '#F0FDF4',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 60,
  },
  profileCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  profileCardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  profileTextWrapper: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  profileNameDark: {
    color: '#F0FDF4',
  },
  profileEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileEmailDark: {
    color: '#94A3B8',
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  sectionCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionCardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionTitleDark: {
    color: '#F0FDF4',
  },
  farmsList: {
    gap: spacing.xs,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceInput,
    gap: spacing.sm,
  },
  farmItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  farmItemActiveDark: {
    backgroundColor: '#13351F',
  },
  farmItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  farmItemTextDark: {
    color: '#94A3B8',
  },
  farmItemTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingRowDark: {
    borderBottomColor: '#23382E',
  },
  settingTextWrapper: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  settingLabelDark: {
    color: '#F0FDF4',
  },
  settingDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingDescDark: {
    color: '#94A3B8',
  },
  langSegment: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceInput,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  langSegmentDark: {
    backgroundColor: '#13211B',
    borderColor: '#23382E',
  },
  langSegmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  langSegmentBtnActive: {
    backgroundColor: colors.primary,
  },
  langSegmentBtnActiveDark: {
    backgroundColor: '#22C55E',
  },
  langSegmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  langSegmentTextDark: {
    color: '#94A3B8',
  },
  langSegmentTextActive: {
    color: '#FFFFFF',
  },
  networkStatusRow: {
    paddingVertical: spacing.xs,
  },
  networkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkStatusText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  networkStatusTextDark: {
    color: '#F0FDF4',
  },
  networkSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginTop: 2,
  },
  networkSubtextDark: {
    color: '#94A3B8',
  },
  actionSection: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  versionTextDark: {
    color: '#64748B',
  },
});
