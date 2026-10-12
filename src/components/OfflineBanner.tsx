import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOfflineSync } from '../features/sync/hooks/useOfflineSync';
import { usePreferences } from '../contexts/PreferencesContext';
import { SyncQueueModal } from './SyncQueueModal';
import { styles } from './styles/offlineBanner.styles';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingQueueCount, isSyncing, syncNow } = useOfflineSync();
  const { language } = usePreferences();
  const [modalVisible, setModalVisible] = useState(false);

  if (isOnline && pendingQueueCount === 0) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
        style={styles.banner}
        accessibilityLabel="Abrir Inspetor da Fila Offline"
      >
        <MaterialCommunityIcons
          name={isOnline ? 'cloud-sync-outline' : 'wifi-off'}
          size={16}
          color="#FEF08A"
          style={styles.icon}
        />
        <Text style={styles.text}>
          {!isOnline
            ? (language === 'en'
                ? 'Offline Field Mode — changes stored locally (Tap to view queue)'
                : 'Modo Campo Offline — alterações salvas no aparelho (Toque p/ ver fila)')
            : (language === 'en'
                ? `${pendingQueueCount} records ready to sync (Tap to inspect)`
                : `${pendingQueueCount} registros prontos para sincronizar (Toque p/ ver)`)}
        </Text>

        {pendingQueueCount > 0 && isOnline && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              void syncNow();
            }}
            disabled={isSyncing}
            style={styles.syncBtn}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#1E293B" />
            ) : (
              <Text style={styles.syncBtnText}>
                {language === 'en' ? 'Sync' : 'Sincronizar'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <SyncQueueModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

