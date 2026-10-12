import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getOfflineQueue,
  clearOfflineQueue,
  seedSimulatedOfflineBatch,
  processQueueDrain,
  OfflineQueueItem,
} from '../services/syncQueue.service';
import { usePreferences } from '../contexts/PreferencesContext';
import { useToast } from '../contexts/ToastContext';
import { triggerHaptic } from '../utils/haptics';
import { styles } from './styles/syncQueueModal.styles';

interface SyncQueueModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SyncQueueModal: React.FC<SyncQueueModalProps> = ({ visible, onClose }) => {
  const { isDark, language } = usePreferences();
  const { showSuccess, showError, showInfo } = useToast();
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [isDraining, setIsDraining] = useState(false);

  const loadQueue = useCallback(async () => {
    const items = await getOfflineQueue();
    setQueue(items);
  }, []);

  useEffect(() => {
    if (visible) {
      void loadQueue();
    }
  }, [visible, loadQueue]);

  const handleDrain = async () => {
    if (queue.length === 0) {
      showInfo(language === 'en' ? 'Queue is already empty' : 'Fila já está vazia');
      return;
    }

    try {
      setIsDraining(true);
      await triggerHaptic('medium');
      const result = await processQueueDrain();
      await triggerHaptic('success');
      showSuccess(
        language === 'en'
          ? `Synced ${result.success} items (${result.failed} retries pending)`
          : `Sincronizados ${result.success} itens (${result.failed} falhas)`
      );
      await loadQueue();
    } catch {
      await triggerHaptic('error');
      showError(language === 'en' ? 'Failed to process sync' : 'Falha ao processar sincronização');
    } finally {
      setIsDraining(false);
    }
  };

  const handleSeed = async () => {
    await triggerHaptic('light');
    const updated = await seedSimulatedOfflineBatch(3);
    setQueue(updated);
    showSuccess(
      language === 'en'
        ? '3 simulated field mutations queued'
        : '3 mutações simuladas adicionadas à fila'
    );
  };

  const handleClear = async () => {
    await triggerHaptic('warning');
    await clearOfflineQueue();
    setQueue([]);
    showInfo(language === 'en' ? 'Offline queue cleared' : 'Fila offline limpa');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
          <View style={styles.header}>
            <View style={styles.titleCol}>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {language === 'en' ? 'Offline Mutation Queue' : 'Fila de Sincronização Offline'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en'
                  ? 'FIFO transactional replay engine & audit'
                  : 'Motor transacional FIFO de reconciliação de campo'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={isDark ? '#FFFFFF' : '#94A3B8'} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{queue.length}</Text>
              <Text style={styles.statLabel}>
                {language === 'en' ? 'Pending Items' : 'Itens Pendentes'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: '#38BDF8' }]}>
                {queue.filter((q) => q.status === 'SYNCING').length}
              </Text>
              <Text style={styles.statLabel}>
                {language === 'en' ? 'In Flight' : 'Em Trânsito'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: '#EF4444' }]}>
                {queue.filter((q) => q.status === 'FAILED').length}
              </Text>
              <Text style={styles.statLabel}>
                {language === 'en' ? 'Retries Left' : 'Retentativas'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.queueList} showsVerticalScrollIndicator={false}>
            {queue.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="cloud-check-outline" size={42} color="#10B981" />
                <Text style={styles.emptyText}>
                  {language === 'en' ? 'All Data In Sync' : 'Tudo 100% Sincronizado'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {language === 'en'
                    ? 'No mutations waiting in the offline queue. Field changes are securely persisted in cloud storage.'
                    : 'Nenhuma alteração pendente no dispositivo. Todos os registros estão consolidados.'}
                </Text>
              </View>
            ) : (
              queue.map((item) => (
                <View key={item.id} style={styles.queueCard}>
                  <View style={styles.queueCardHeader}>
                    <View style={styles.badgePill}>
                      <MaterialCommunityIcons name="sync" size={12} color="#4ADE80" />
                      <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.timeText}>
                      {new Date(item.queuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={styles.entityTitle}>{item.entityName}</Text>
                  <Text style={styles.payloadPreview} numberOfLines={2}>
                    {JSON.stringify(item.payload)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDrain}
              disabled={isDraining}
              style={styles.primaryBtn}
            >
              {isDraining ? (
                <ActivityIndicator color="#07150E" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#07150E" />
                  <Text style={styles.primaryBtnText}>
                    {language === 'en' ? 'Process Queue Drain' : 'Processar Drenagem da Fila'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleSeed} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>
                  {language === 'en' ? '+ Sim. Batch' : '+ Simular Lote'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClear}
                style={[styles.secondaryBtn, styles.dangerBtn]}
              >
                <Text style={[styles.secondaryBtnText, styles.dangerBtnText]}>
                  {language === 'en' ? 'Clear Queue' : 'Limpar Fila'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
