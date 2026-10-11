import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOfflineSync } from '../features/sync/hooks/useOfflineSync';
import { radii, spacing, typography } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

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

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#854D0E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    ...typography.micro,
    color: '#FEF08A',
    fontWeight: '600',
    flexShrink: 1,
  },
  syncBtn: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    marginLeft: 6,
  },
  syncBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#713F12',
  },
});
