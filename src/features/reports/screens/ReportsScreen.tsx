import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { usePlantations } from '../../plantations/hooks/usePlantations';
import { useFarms } from '../../farms/hooks/useFarms';
import { useActivities } from '../../activities/hooks/useActivities';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { generateAndSharePdfReport } from '../../../services/pdfReport.service';
import {
  exportToGeoJson,
  exportToKml,
  exportToCsv,
  triggerAgroFileDownload,
} from '../../../services/export/exportAgroData.service';
import { triggerHaptic } from '../../../utils/haptics';

import { Screen } from '../../../components/Screen';
import { LoadingState } from '../../../components/LoadingState';
import { AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { getCropLabel, formatHectares } from '../../../utils/formatters';

export const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { data: plantations, isLoading: loadingPlantations } = usePlantations();
  const { data: farms, isLoading: loadingFarms } = useFarms();
  const { data: activities, isLoading: loadingActivities } = useActivities();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  if (loadingPlantations || loadingFarms || loadingActivities) {
    return (
      <LoadingState
        message={language === 'en' ? 'Generating consolidated reports...' : 'Gerando relatórios consolidados...'}
      />
    );
  }

  const totalArea = plantations?.reduce((acc, p) => acc + p.areaHectares, 0) || 0;
  const completedActivities = activities?.filter((a) => a.completed).length || 0;
  const totalActivities = activities?.length || 0;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const cropDistribution = new Map<string, number>();
  plantations?.forEach((p) => {
    const label = getCropLabel(p.cropType, language);
    cropDistribution.set(label, (cropDistribution.get(label) || 0) + p.areaHectares);
  });

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await triggerHaptic('medium');
      await generateAndSharePdfReport({
        farm: farms?.[0],
        plantations: plantations || [],
        activities: activities || [],
        totalArea,
        completionRate,
        userName: user?.name,
        language,
      });
      showSuccess(language === 'en' ? 'PDF report ready to share!' : 'Relatório PDF gerado com sucesso!');
    } catch {
      showError(language === 'en' ? 'Could not generate PDF' : 'Não foi possível gerar o PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGeoJson = async () => {
    try {
      await triggerHaptic('light');
      const content = exportToGeoJson(farms || [], plantations || []);
      await triggerAgroFileDownload('farmflow_talhoes.geojson', content, 'application/geo+json');
      showSuccess(language === 'en' ? 'GeoJSON downloaded successfully!' : 'GeoJSON exportado com sucesso!');
    } catch {
      showError(language === 'en' ? 'Error exporting GeoJSON' : 'Erro ao exportar GeoJSON');
    }
  };

  const handleExportKml = async () => {
    try {
      await triggerHaptic('light');
      const content = exportToKml(farms || [], plantations || []);
      await triggerAgroFileDownload('farmflow_talhoes.kml', content, 'application/vnd.google-earth.kml+xml');
      showSuccess(language === 'en' ? 'KML GPS file downloaded!' : 'Arquivo KML gerado com sucesso!');
    } catch {
      showError(language === 'en' ? 'Error exporting KML' : 'Erro ao exportar KML');
    }
  };

  const handleExportCsv = async () => {
    try {
      await triggerHaptic('light');
      const content = exportToCsv(farms || [], plantations || []);
      await triggerAgroFileDownload('farmflow_relatorio.csv', content, 'text/csv');
      showSuccess(language === 'en' ? 'CSV spreadsheet downloaded!' : 'Planilha CSV exportada com sucesso!');
    } catch {
      showError(language === 'en' ? 'Error exporting CSV' : 'Erro ao exportar CSV');
    }
  };

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
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
          <View style={styles.titleTextWrapper}>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Reports & Productivity' : 'Relatórios & Produtividade'}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {language === 'en' ? 'Executive overview of farm operations' : 'Visão executiva das operações e safras'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleExportPdf}
            disabled={isExporting}
            style={[styles.headerExportBtn, isDark && styles.headerExportBtnDark]}
            accessibilityLabel="Exportar PDF"
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <MaterialCommunityIcons name="file-pdf-box" size={24} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
            <MaterialCommunityIcons
              name="home-city-outline"
              size={22}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
            <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
              {language === 'en' ? 'Farms' : 'Fazendas'}
            </Text>
            <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
              {farms?.length || 0}
            </Text>
          </View>

          <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
            <MaterialCommunityIcons
              name="sprout"
              size={22}
              color={isDark ? '#A3E635' : colors.accentLime}
            />
            <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
              {language === 'en' ? 'Fields' : 'Talhões'}
            </Text>
            <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
              {plantations?.length || 0}
            </Text>
          </View>

          <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
            <MaterialCommunityIcons
              name="vector-square"
              size={22}
              color={isDark ? '#FDE047' : colors.accentGold}
            />
            <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
              {language === 'en' ? 'Total Area' : 'Área Total'}
            </Text>
            <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
              {formatHectares(totalArea, language)}
            </Text>
          </View>

          <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={22}
              color={isDark ? '#38BDF8' : colors.accentBlue}
            />
            <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
              {language === 'en' ? 'Completion' : 'Conclusão'}
            </Text>
            <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
              {completionRate}%
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="chart-pie"
              size={20}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
              {language === 'en' ? 'Crop Distribution' : 'Ocupação por Cultura Agrícola'}
            </Text>
          </View>

          {Array.from(cropDistribution.entries()).map(([crop, ha]) => {
            const pct = totalArea > 0 ? (ha / totalArea) * 100 : 0;
            return (
              <View key={crop} style={styles.cropRow}>
                <View style={styles.cropRowLabels}>
                  <Text style={[styles.cropName, isDark && styles.cropNameDark]}>{crop}</Text>
                  <Text style={[styles.cropHa, isDark && styles.cropHaDark]}>
                    {formatHectares(ha, language)} ({Math.round(pct)}%)
                  </Text>
                </View>
                <View style={[styles.progressBarTrack, isDark && styles.progressBarTrackDark]}>
                  <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={20}
              color={isDark ? '#A3E635' : colors.accentLime}
            />
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
              {language === 'en' ? 'Operational Efficiency' : 'Eficiência Operacional em Campo'}
            </Text>
          </View>

          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>
              {language === 'en' ? 'Tasks Completed on Schedule' : 'Tarefas Realizadas no Prazo'}
            </Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {completedActivities} {language === 'en' ? 'of' : 'de'} {totalActivities}{' '}
              {language === 'en' ? 'activities' : 'atividades'}
            </Text>
          </View>

          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>
              {language === 'en' ? 'Average Field Area' : 'Média de Área por Talhão'}
            </Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>
              {plantations && plantations.length > 0
                ? formatHectares(totalArea / plantations.length, language)
                : '0 ha'}
            </Text>
          </View>
        </View>

        <View style={[styles.precisionExportCard, isDark && styles.precisionExportCardDark]}>
          <View style={styles.precisionCardHeader}>
            <MaterialCommunityIcons name="tractor" size={20} color="#22C55E" />
            <Text style={[styles.precisionCardTitle, isDark && styles.precisionCardTitleDark]}>
              {language === 'en' ? 'Precision Agriculture GPS Export' : 'Exportações para GPS e Piloto Automático'}
            </Text>
          </View>
          <Text style={[styles.precisionCardDesc, isDark && styles.precisionCardDescDark]}>
            {language === 'en'
              ? 'Export field boundaries and operational data for John Deere, Trimble and Climate FieldView systems.'
              : 'Exporte limites vetoriais dos talhões para monitores de bordo John Deere, Trimble e Climate FieldView.'}
          </Text>

          <View style={styles.precisionBtnRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleExportGeoJson}
              style={[styles.precisionBtn, styles.geoBtn]}
            >
              <MaterialCommunityIcons name="map-marker-path" size={16} color="#FFFFFF" />
              <Text style={styles.precisionBtnText}>GeoJSON</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleExportKml}
              style={[styles.precisionBtn, styles.kmlBtn]}
            >
              <MaterialCommunityIcons name="earth" size={16} color="#FFFFFF" />
              <Text style={styles.precisionBtnText}>KML (GPS)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleExportCsv}
              style={[styles.precisionBtn, styles.csvBtn]}
            >
              <MaterialCommunityIcons name="file-delimited" size={16} color="#FFFFFF" />
              <Text style={styles.precisionBtnText}>
                {language === 'en' ? 'CSV Sheet' : 'Planilha CSV'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleExportPdf}
          disabled={isExporting}
          style={[styles.bottomExportBtn, isDark && styles.bottomExportBtnDark]}
        >
          {isExporting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="file-pdf-box" size={22} color="#FFFFFF" />
          )}
          <Text style={styles.bottomExportText}>
            {isExporting
              ? (language === 'en' ? 'Generating Official PDF...' : 'Gerando PDF Oficial...')
              : (language === 'en' ? 'Export & Share PDF Report' : 'Exportar & Compartilhar Relatório em PDF')}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerExportBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerExportBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  bottomExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: radii.xl,
    paddingVertical: 14,
    gap: 8,
    marginTop: spacing.sm,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomExportBtnDark: {
    backgroundColor: '#10B981',
  },
  bottomExportText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    width: 40,
    height: 40,
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
  titleTextWrapper: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.caption,
    color: '#4A5E54',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#CBD5E1',
  },
  content: {
    padding: spacing.base,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  summaryLabel: {
    ...typography.micro,
    color: '#64748B',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  summaryLabelDark: {
    color: '#CBD5E1',
  },
  summaryValue: {
    ...typography.h3,
    color: '#172B23',
  },
  summaryValueDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#172B23',
    marginLeft: spacing.sm,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cropRow: {
    marginBottom: spacing.md,
  },
  cropRowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cropName: {
    ...typography.captionMedium,
    color: '#172B23',
  },
  cropNameDark: {
    color: '#FFFFFF',
  },
  cropHa: {
    ...typography.caption,
    color: '#4A5E54',
  },
  cropHaDark: {
    color: '#CBD5E1',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F4F6F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarTrackDark: {
    backgroundColor: '#14251D',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E7DB',
  },
  metricItemDark: {
    borderBottomColor: '#2C493A',
  },
  metricLabel: {
    ...typography.caption,
    color: '#4A5E54',
  },
  metricLabelDark: {
    color: '#CBD5E1',
  },
  metricVal: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  metricValDark: {
    color: '#FFFFFF',
  },
  precisionExportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E2E8DB',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  precisionExportCardDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  precisionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  precisionCardTitle: {
    ...typography.bodyBold,
    fontWeight: '700',
    color: '#172B23',
  },
  precisionCardTitleDark: {
    color: '#FFFFFF',
  },
  precisionCardDesc: {
    ...typography.micro,
    color: '#4A5E54',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  precisionCardDescDark: {
    color: '#94A3B8',
  },
  precisionBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  precisionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.md,
    gap: 6,
  },
  geoBtn: {
    backgroundColor: '#0284C7',
  },
  kmlBtn: {
    backgroundColor: '#16A34A',
  },
  csvBtn: {
    backgroundColor: '#D97706',
  },
  precisionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
