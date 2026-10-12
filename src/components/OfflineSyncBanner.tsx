import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOfflineSync } from '../features/sync/hooks/useOfflineSync';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/offlineSyncBanner.styles';

export const OfflineSyncBanner: React.FC = () => {
  const { isOnline, pendingQueueCount, isSyncing, syncNow } = useOfflineSync();
  const { isDark, language } = usePreferences();

  if (isOnline && pendingQueueCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.leftRow}>
        <MaterialCommunityIcons
          name={isOnline ? 'cloud-upload-outline' : 'wifi-off'}
          size={18}
          color={isOnline ? '#059669' : '#D97706'}
        />
        <View style={styles.textCol}>
          <Text style={[styles.mainText, isDark && styles.mainTextDark]}>
            {!isOnline
              ? (language === 'en' ? 'Offline Field Mode' : 'Modo Campo Offline')
              : (language === 'en' ? 'Pending Cloud Sync' : 'Sincronização Pendente')}
          </Text>
          <Text style={[styles.subText, isDark && styles.subTextDark]}>
            {pendingQueueCount > 0
              ? `${pendingQueueCount} ${language === 'en' ? 'records saved locally' : 'registros salvos no aparelho'}`
              : language === 'en' ? 'Working without connection' : 'Operando sem internet'}
          </Text>
        </View>
      </View>

      {pendingQueueCount > 0 && isOnline && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={syncNow}
          disabled={isSyncing}
          style={styles.syncBtn}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="sync" size={14} color="#FFFFFF" />
              <Text style={styles.syncBtnText}>
                {language === 'en' ? 'Sync' : 'Enviar'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

