import React, { useState } from 'react';
import {
  View,
  Text,
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
import { colors } from '../../../theme';
import { checkBiometricSupport, authenticateWithBiometrics } from '../../../services/security/biometrics.service';
import { SyncQueueModal } from '../../../components/SyncQueueModal';
import { AgroDevToolsModal } from '../../../components/AgroDevToolsModal';
import { styles } from '../styles/settings.styles';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { user, signOut } = useAuth();
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [devToolsVisible, setDevToolsVisible] = useState(false);
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
    <Screen scrollable>
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

        <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'en' ? 'Field Engineering & DevTools' : 'Engenharia de Campo & DevTools'}
          </Text>

          <View style={[styles.settingRow, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons name="sync" size={20} color="#38BDF8" />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Offline Mutation Queue' : 'Fila de Mutações Offline'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Audit transactional local mutations and trigger forced cloud drain'
                  : 'Inspecione a fila FIFO transacional e force sincronização em lote'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSyncModalVisible(true)}
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#38BDF8',
              }}
            >
              <Text style={{ color: '#38BDF8', fontWeight: '700', fontSize: 12 }}>
                {language === 'en' ? 'Inspect' : 'Inspecionar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }, isDark && styles.settingRowDark]}>
            <View style={styles.settingTextWrapper}>
              <View style={styles.settingLabelRow}>
                <MaterialCommunityIcons name="flask-outline" size={20} color="#FACC15" />
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  {language === 'en' ? 'Agro Field Simulator' : 'Simulador de Cenários Agro'}
                </Text>
              </View>
              <Text style={[styles.settingDesc, isDark && styles.settingDescDark]}>
                {language === 'en'
                  ? 'Inject failure boundaries, frost alerts, and burst offline loads'
                  : 'Injete alertas de geada, simulação de estresse e falhas de sensores'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setDevToolsVisible(true)}
              style={{
                backgroundColor: 'rgba(250, 204, 21, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#FACC15',
              }}
            >
              <Text style={{ color: '#FACC15', fontWeight: '700', fontSize: 12 }}>
                {language === 'en' ? 'Open' : 'Abrir'}
              </Text>
            </TouchableOpacity>
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

      <SyncQueueModal visible={syncModalVisible} onClose={() => setSyncModalVisible(false)} />
      <AgroDevToolsModal visible={devToolsVisible} onClose={() => setDevToolsVisible(false)} />
    </Screen>
  );
};

