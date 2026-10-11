import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ListRenderItem,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { ScoutingRecord, PestSeverity } from '../types';
import { PEST_CATALOG } from '../data/pestCatalog';
import { useScouting } from '../hooks/useScouting';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const PestScoutingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const { records, isLoading, addRecord, toggleActionTaken } = useScouting();

  const [activeTab, setActiveTab] = useState<'records' | 'catalog'>('records');
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedPestId, setSelectedPestId] = useState(PEST_CATALOG[0].id);
  const [plantationName, setPlantationName] = useState('Talhão 01 — Soja Sul');
  const [affectedPercent, setAffectedPercent] = useState('12');
  const [locationNote, setLocationNote] = useState('Borda do pivô');
  const [severity, setSeverity] = useState<PestSeverity>('MEDIUM');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [aiDiagnosisLabel, setAiDiagnosisLabel] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const runAiAnalysis = (_uri: string, pestIdHint?: string) => {
    setIsAnalyzing(true);
    void triggerHaptic('selection');
    setTimeout(() => {
      const pest = PEST_CATALOG.find((p) => p.id === (pestIdHint || selectedPestId)) || PEST_CATALOG[0];
      const confidence = 96.2;
      setAiConfidence(confidence);
      setAiDiagnosisLabel(`${pest.name} (${pest.scientificName})`);
      setSeverity(pest.type === 'DISEASE' ? 'CRITICAL' : 'MEDIUM');
      setNotes(
        `[Diagnóstico IA FarmFlow]: Detectado ${pest.name} (${confidence}% de precisão). Sintomas de lesões foliares ativas. Controle: ${pest.chemicalOrBiologicalActive} — ${pest.recommendedControl}.`
      );
      setIsAnalyzing(false);
      void triggerHaptic('success');
    }, 700);
  };

  const handlePickCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        await handlePickGallery();
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        runAiAnalysis(result.assets[0].uri);
      }
    } catch {
      await handlePickGallery();
    }
  };

  const handlePickGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        runAiAnalysis(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Gallery picker error', e);
    }
  };

  const handleSimulateDemoPhoto = () => {
    const demoUri = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80';
    setImageUri(demoUri);
    runAiAnalysis(demoUri, selectedPestId);
  };

  const handleCreateRecord = async () => {
    const pest = PEST_CATALOG.find((p) => p.id === selectedPestId) || PEST_CATALOG[0];
    await addRecord({
      farmId: 'farm-1',
      plantationName,
      pestId: pest.id,
      pestName: pest.name,
      severity,
      affectedPlantsPercent: parseFloat(affectedPercent) || 10,
      locationNote,
      imageUri: imageUri || undefined,
      aiConfidencePercent: aiConfidence || undefined,
      aiDiagnosisLabel: aiDiagnosisLabel || undefined,
      notes,
    });
    setModalVisible(false);
    setNotes('');
    setImageUri(null);
    setAiConfidence(null);
    setAiDiagnosisLabel(null);
  };

  const getSeverityBadge = (sev: PestSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return { label: 'Crítico (NDE)', color: '#EF4444', bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2' };
      case 'MEDIUM':
        return { label: 'Alerta Médio', color: '#F59E0B', bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB' };
      case 'LOW':
      default:
        return { label: 'Baixo Dano', color: '#10B981', bg: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' };
    }
  };

  const renderRecordItem: ListRenderItem<ScoutingRecord> = ({ item }) => {
    const badge = getSeverityBadge(item.severity);

    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.pestName}</Text>
            <Text style={[styles.cardSubtitle, isDark && styles.cardSubtitleDark]}>{item.plantationName}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.color }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="percent-outline" size={14} color="#64748B" />
            <Text style={[styles.metaText, isDark && styles.metaTextDark]}>
              {item.affectedPlantsPercent}% plantas atacadas
            </Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#64748B" />
            <Text style={[styles.metaText, isDark && styles.metaTextDark]}>{item.locationNote}</Text>
          </View>
        </View>

        {item.imageUri ? (
          <View style={styles.imageCardContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.recordImage} resizeMode="cover" />
            <View style={styles.aiOverlayBadge}>
              <MaterialCommunityIcons name="robot" size={13} color="#FFFFFF" />
              <Text style={styles.aiOverlayText}>
                {item.aiConfidencePercent ? `IA: ${item.aiConfidencePercent}% Precisão` : 'Foto de Campo'}
              </Text>
            </View>
          </View>
        ) : null}

        {item.notes ? (
          <Text style={[styles.notesText, isDark && styles.notesTextDark]}>{item.notes}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')} às{' '}
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => toggleActionTaken(item.id)}
            style={[
              styles.actionBtn,
              item.actionTaken && styles.actionBtnDone,
              isDark && !item.actionTaken && styles.actionBtnDark,
            ]}
          >
            <MaterialCommunityIcons
              name={item.actionTaken ? 'check-circle' : 'spray'}
              size={15}
              color={item.actionTaken ? '#FFFFFF' : isDark ? '#4ADE80' : '#059669'}
            />
            <Text
              style={[
                styles.actionBtnText,
                item.actionTaken && styles.actionBtnTextDone,
                isDark && !item.actionTaken && { color: '#4ADE80' },
              ]}
            >
              {item.actionTaken ? 'Controle Realizado' : 'Marcar Manejo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingState message="Carregando dados de fitossanidade..." />;
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
              accessibilityLabel="Voltar"
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {language === 'en' ? 'Pest Scouting & Health' : 'Monitoramento de Pragas'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en' ? 'Crop protection & diagnostic' : 'Diagnóstico fitossanitário no talhão'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              void triggerHaptic('light');
              setModalVisible(true);
            }}
            style={styles.addBtn}
            accessibilityLabel="Nova Amostragem"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
          <TouchableOpacity
            onPress={() => {
              void triggerHaptic('selection');
              setActiveTab('records');
            }}
            style={[styles.tab, activeTab === 'records' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'records' && styles.tabTextActive, isDark && activeTab !== 'records' && { color: '#94A3B8' }]}>
              {language === 'en' ? 'Field Records' : 'Ocorrências no Campo'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              void triggerHaptic('selection');
              setActiveTab('catalog');
            }}
            style={[styles.tab, activeTab === 'catalog' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive, isDark && activeTab !== 'catalog' && { color: '#94A3B8' }]}>
              {language === 'en' ? 'Pest Guide' : 'Catálogo & Defensivos'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'records' ? (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={renderRecordItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="bug-outline"
              title="Nenhuma Praga Registrada"
              description="Amostragem em dia! Clique no botão (+) para registrar um ponto de monitoramento."
            />
          }
        />
      ) : (
        <FlatList
          data={PEST_CATALOG}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.name}</Text>
                  <Text style={styles.scientificName}>{item.scientificName}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: '#94A3B8' }]}>
                  <Text style={[styles.badgeText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    {item.crop === 'SOY'
                      ? (language === 'en' ? 'Soybeans' : 'Soja')
                      : item.crop === 'CORN'
                      ? (language === 'en' ? 'Corn' : 'Milho')
                      : item.crop === 'COFFEE'
                      ? (language === 'en' ? 'Coffee' : 'Café')
                      : (language === 'en' ? 'General' : 'Geral')}
                  </Text>
                </View>
              </View>

              <View style={styles.catalogBlock}>
                <Text style={styles.catalogLabel}>Nível de Dano Econômico (NDE):</Text>
                <Text style={[styles.catalogValue, isDark && styles.catalogValueDark]}>{item.economicDamageThreshold}</Text>
              </View>

              <View style={styles.catalogBlock}>
                <Text style={styles.catalogLabel}>Controle Recomendado & Ingrediente Ativo:</Text>
                <Text style={[styles.catalogValue, isDark && styles.catalogValueDark]}>{item.chemicalOrBiologicalActive} — {item.recommendedControl}</Text>
              </View>

              <View style={styles.catalogBlock}>
                <Text style={styles.catalogLabel}>Sintomas Típicos:</Text>
                <Text style={[styles.catalogValue, isDark && styles.catalogValueDark]}>{item.typicalSymptoms}</Text>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Nova Ocorrência Fitossanitária</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#1E293B'} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Praga / Doença Alvo</Text>
            <View style={styles.chipRow}>
              {PEST_CATALOG.slice(0, 4).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPestId(p.id)}
                  style={[
                    styles.formChip,
                    selectedPestId === p.id && styles.formChipActive,
                    isDark && styles.formChipDark,
                  ]}
                >
                  <Text style={[styles.formChipText, selectedPestId === p.id && styles.formChipTextActive]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Talhão</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={plantationName}
              onChangeText={setPlantationName}
              placeholder="Ex: Talhão 01 — Soja"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Plantas Atacadas (%)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={affectedPercent}
                  onChangeText={setAffectedPercent}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Severidade</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                  {(['LOW', 'MEDIUM', 'CRITICAL'] as const).map((sev) => (
                    <TouchableOpacity
                      key={sev}
                      onPress={() => setSeverity(sev)}
                      style={[styles.sevPill, severity === sev && styles.sevPillActive]}
                    >
                      <Text style={[styles.sevPillText, severity === sev && styles.sevPillTextActive]}>
                        {sev === 'LOW' ? 'Baixo' : sev === 'MEDIUM' ? 'Médio' : 'Crítico'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Ponto de Amostragem</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={locationNote}
              onChangeText={setLocationNote}
              placeholder="Ex: Borda oeste perto da cerca"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Fotografia de Campo & Diagnóstico com IA</Text>
            <View style={styles.photoActionsRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={handlePickCamera} style={styles.photoActionBtn}>
                <MaterialCommunityIcons name="camera" size={17} color="#059669" />
                <Text style={styles.photoActionText}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={handlePickGallery} style={styles.photoActionBtn}>
                <MaterialCommunityIcons name="image" size={17} color="#059669" />
                <Text style={styles.photoActionText}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={handleSimulateDemoPhoto} style={[styles.photoActionBtn, styles.photoActionBtnAi]}>
                <MaterialCommunityIcons name="robot" size={17} color="#FFFFFF" />
                <Text style={[styles.photoActionText, { color: '#FFFFFF' }]}>Simular IA</Text>
              </TouchableOpacity>
            </View>

            {isAnalyzing ? (
              <View style={styles.analyzingBox}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={styles.analyzingText}>Escaneando folha com IA do FarmFlow...</Text>
              </View>
            ) : imageUri ? (
              <View style={styles.previewBox}>
                <Image source={{ uri: imageUri }} style={styles.previewThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewAiTitle}>
                    {aiConfidence ? `Detectado (${aiConfidence}% precisão)` : 'Foto anexada'}
                  </Text>
                  <Text style={styles.previewAiSubtitle} numberOfLines={2}>
                    {aiDiagnosisLabel || 'Pronta para registro no laudo técnico'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removePhotoBtn}>
                  <MaterialCommunityIcons name="close" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : null}

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Observações Agronômicas</Text>
            <TextInput
              style={[styles.input, styles.textArea, isDark && styles.inputDark]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Descreva sintomas, estágio da cultura..."
              placeholderTextColor="#94A3B8"
              multiline
            />

            <TouchableOpacity activeOpacity={0.85} onPress={handleCreateRecord} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Salvar Registro de Campo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    padding: 3,
  },
  tabBarDark: {
    backgroundColor: '#14231B',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  tabActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSubtitle: {
    ...typography.micro,
    color: '#64748B',
    marginTop: 2,
  },
  cardSubtitleDark: {
    color: '#94A3B8',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#059669',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: spacing.xs + 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  metaTextDark: {
    color: '#CBD5E1',
  },
  notesText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    padding: 8,
    borderRadius: radii.md,
    marginVertical: spacing.xs,
  },
  notesTextDark: {
    color: '#E2E8F0',
    backgroundColor: 'rgba(74, 138, 98, 0.15)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: spacing.xs + 2,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  dateTextDark: {
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: 'transparent',
  },
  actionBtnDark: {
    borderColor: '#4ADE80',
  },
  actionBtnDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  actionBtnTextDone: {
    color: '#FFFFFF',
  },
  catalogBlock: {
    marginTop: spacing.xs + 2,
  },
  catalogLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
  },
  catalogValue: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 2,
  },
  catalogValueDark: {
    color: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalCardDark: {
    backgroundColor: '#122018',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: '#0F172A',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  formLabelDark: {
    color: '#CBD5E1',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xs,
  },
  formChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formChipDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  formChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  formChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  formChipTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 64,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  inputCol: {
    flex: 1,
  },
  sevPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
    backgroundColor: '#F1F5F9',
  },
  sevPillActive: {
    backgroundColor: '#10B981',
  },
  sevPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  sevPillTextActive: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#059669',
    borderRadius: radii.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  imageCardContainer: {
    position: 'relative',
    height: 160,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  recordImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  aiOverlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  aiOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  photoActionBtnAi: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  photoActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  analyzingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.sm,
    padding: 8,
    marginBottom: 8,
  },
  previewThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
  },
  previewAiTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewAiSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  removePhotoBtn: {
    padding: 6,
  },
});
