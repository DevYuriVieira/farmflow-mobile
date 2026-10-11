import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { triggerHaptic } from '../../../utils/haptics';
import { observabilityService } from '../../../services/observability/observability.service';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      observabilityService.setNetworkStatus(online);
      if (!online) {
        setPendingQueueCount((prev) => (prev === 0 ? 2 : prev));
      }
    });

    return () => unsubscribe();
  }, []);

  const syncNow = async () => {
    if (pendingQueueCount === 0) return;
    try {
      setIsSyncing(true);
      await triggerHaptic('medium');
      await new Promise((res) => setTimeout(res, 900));
      setPendingQueueCount(0);
      await triggerHaptic('success');
    } finally {
      setIsSyncing(false);
    }
  };

  const queueOfflineItem = () => {
    setPendingQueueCount((prev) => prev + 1);
  };

  return {
    isOnline,
    pendingQueueCount,
    isSyncing,
    syncNow,
    queueOfflineItem,
  };
}
