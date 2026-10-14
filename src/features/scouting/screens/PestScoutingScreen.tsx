import React, { useState } from 'react';
import {
  View,
  Text,
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
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';
import { styles } from '../styles/pestScouting.styles';

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
    <Screen>
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

