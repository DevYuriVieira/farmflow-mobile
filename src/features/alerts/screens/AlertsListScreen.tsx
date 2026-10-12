import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FarmAlert, AlertSeverity } from '../types';
import { useAlerts } from '../hooks/useAlerts';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';
import { styles } from '../styles/alertsList.styles';

export const AlertsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const { alerts, isLoading, markAsRead, markAllAsRead, unreadCount } = useAlerts();

  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'ALL'>('ALL');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const getSeverityMeta = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          color: '#EF4444',
          bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
          border: 'rgba(239, 68, 68, 0.4)',
          icon: 'alert-decagram' as const,
          label: language === 'en' ? 'Critical' : 'Crítico',
        };
      case 'WARNING':
        return {
          color: '#F59E0B',
          bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB',
          border: 'rgba(245, 158, 11, 0.4)',
          icon: 'alert' as const,
          label: language === 'en' ? 'Warning' : 'Atenção',
        };
      case 'INFO':
      default:
        return {
          color: '#3B82F6',
          bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
          border: 'rgba(59, 130, 246, 0.4)',
          icon: 'information-outline' as const,
          label: language === 'en' ? 'Info' : 'Informativo',
        };
    }
  };

  const handleAlertPress = async (alert: FarmAlert) => {
    if (!alert.isRead) {
      await markAsRead(alert.id);
    }
    if (alert.actionRoute) {
      (navigation as any).navigate(alert.actionRoute, alert.actionParams || {});
    }
  };

  const renderItem: ListRenderItem<FarmAlert> = ({ item }) => {
    const meta = getSeverityMeta(item.severity);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleAlertPress(item)}
        style={[
          styles.card,
          isDark && styles.cardDark,
          !item.isRead && styles.cardUnread,
          !item.isRead && isDark && styles.cardUnreadDark,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
            <MaterialCommunityIcons name={meta.icon} size={14} color={meta.color} />
            <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
          </View>

          {!item.isRead && (
            <View style={styles.unreadDot} />
          )}
        </View>

        <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.title}</Text>
        <Text style={[styles.cardMessage, isDark && styles.cardMessageDark]}>{item.message}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.timeRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color={isDark ? '#94A3B8' : '#64748B'}
            />
            <Text style={[styles.timeText, isDark && styles.timeTextDark]}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          {item.actionRoute && (
            <View style={styles.actionPrompt}>
              <Text style={styles.actionPromptText}>
                {language === 'en' ? 'View details' : 'Ver detalhes'}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#10B981" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingState message={language === 'en' ? 'Checking field alerts...' : 'Verificando alertas de campo...'} />;
  }

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={[styles.backBtn, isDark && styles.backBtnDark]}
              accessibilityLabel={language === 'en' ? 'Back' : 'Voltar'}
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {language === 'en' ? 'Farm Alerts' : 'Alertas da Lavoura'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {unreadCount > 0
                  ? `${unreadCount} ${language === 'en' ? 'unread alerts' : 'alertas não lidos'}`
                  : language === 'en' ? 'All caught up' : 'Tudo atualizado'}
              </Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={[styles.readAllBtn, isDark && styles.readAllBtnDark]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="check-all" size={18} color="#10B981" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersRow}>
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => {
            const isSelected = selectedSeverity === sev;
            const labelMap = {
              ALL: language === 'en' ? 'All' : 'Todos',
              CRITICAL: language === 'en' ? 'Critical' : 'Críticos',
              WARNING: language === 'en' ? 'Warnings' : 'Avisos',
              INFO: language === 'en' ? 'Info' : 'Informativo',
            };

            return (
              <TouchableOpacity
                key={sev}
                activeOpacity={0.75}
                onPress={() => {
                  void triggerHaptic('selection');
                  setSelectedSeverity(sev);
                }}
                style={[
                  styles.filterChip,
                  isDark && styles.filterChipDark,
                  isSelected && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isDark && styles.filterChipTextDark,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {labelMap[sev]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bell-check-outline"
            title={language === 'en' ? 'No Alerts Found' : 'Nenhum Alerta Ativo'}
            description={language === 'en' ? 'Your fields and crops are in optimal condition.' : 'Seus talhões e lavouras operam em condições ideais.'}
          />
        }
      />
    </Screen>
  );
};

