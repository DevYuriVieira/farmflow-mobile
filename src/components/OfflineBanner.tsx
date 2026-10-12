import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOfflineSync } from '../features/sync/hooks/useOfflineSync';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/offlineBanner.styles';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingQueueCount, isSyncing, syncNow } = useOfflineSync();
  const { language } = usePreferences();

  if (isOnline && pendingQueueCount === 0) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons
        name={isOnline ? 'cloud-sync-outline' : 'wifi-off'}
        size={16}
        color="#FEF08A"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {!isOnline
          ? (language === 'en'
              ? 'Offline Field Mode — changes stored locally'
              : 'Modo Campo Offline — alterações salvas no aparelho')
          : (language === 'en'
              ? `${pendingQueueCount} records ready to sync`
              : `${pendingQueueCount} registros prontos para sincronizar`)}
      </Text>

      {pendingQueueCount > 0 && isOnline && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={syncNow}
          disabled={isSyncing}
          style={styles.syncBtn}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#1E293B" />
          ) : (
            <Text style={styles.syncBtnText}>
              {language === 'en' ? 'Sync Now' : 'Sincronizar'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

