import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
  },
  backBtnDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  title: {
    ...typography.h2,
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.micro,
    color: '#64748B',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  readAllBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  readAllBtnDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextDark: {
    color: '#CBD5E1',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.base,
    gap: spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  cardUnread: {
    borderColor: 'rgba(16, 185, 129, 0.45)',
    backgroundColor: '#F0FDF4',
  },
  cardUnreadDark: {
    borderColor: 'rgba(16, 185, 129, 0.6)',
    backgroundColor: '#162C21',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#0F172A',
    marginBottom: 4,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardMessage: {
    ...typography.caption,
    color: '#475569',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  cardMessageDark: {
    color: '#CBD5E1',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: spacing.xs + 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  timeTextDark: {
    color: '#94A3B8',
  },
  actionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionPromptText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
});
