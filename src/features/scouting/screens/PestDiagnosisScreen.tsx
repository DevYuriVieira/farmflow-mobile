import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Screen } from '../../../components/Screen';
import { SignaturePad } from '../../../components/SignaturePad';
import { usePreferences } from '../../../contexts/PreferencesContext';
import {
  PEST_CATALOG,
  PestDiagnosisResult,
  classifyPestImageAsync,
} from '../services/pestAiClassifier.service';
import { useScouting } from '../hooks/useScouting';
import { styles } from '../styles/pestDiagnosis.styles';

export const PestDiagnosisScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeColors, touchTargetMinHeight, highContrastFieldMode, language } = usePreferences();
  const { addRecord } = useScouting();

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<PestDiagnosisResult>(PEST_CATALOG[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handlePickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Acesso à câmera é necessário para fotografar pragas.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        const classification = await classifyPestImageAsync(uri, selectedDiagnosis.cropType);
        setSelectedDiagnosis(classification);
        setIsSaved(false);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Acesso à galeria é necessário.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        const classification = await classifyPestImageAsync(uri, selectedDiagnosis.cropType);
        setSelectedDiagnosis(classification);
        setIsSaved(false);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleSelectSample = (item: PestDiagnosisResult) => {
    setSelectedDiagnosis(item);
    setImageUri(null);
    setIsSaved(false);
  };

  const handleSaveToScouting = async () => {
    const sev =
      selectedDiagnosis.severity === 'critical' || selectedDiagnosis.severity === 'high'
        ? ('CRITICAL' as const)
        : ('MEDIUM' as const);

    await addRecord({
      farmId: 'farm-1',
      pestId: selectedDiagnosis.pestId,
      pestName: selectedDiagnosis.commonName,
      plantationName: `Talhão Piloto — ${selectedDiagnosis.cropType}`,
      affectedPlantsPercent: 18,
      locationNote: 'Detecção por Visão Computacional IA',
      severity: sev,
      notes: `Diagnóstico IA: ${selectedDiagnosis.commonName} (${selectedDiagnosis.confidencePercent}% confiança). Prescrição: ${selectedDiagnosis.activeIngredientRecommendation}.${digitalSignature ? ' [Assinatura Digital Anexada]' : ''}`,
      imageUri: imageUri || undefined,
      aiConfidencePercent: selectedDiagnosis.confidencePercent,
      aiDiagnosisLabel: selectedDiagnosis.commonName,
    });
    setIsSaved(true);
    Alert.alert('Salvo com Sucesso', 'Diagnóstico agronômico integrado ao monitoramento fitossanitário!');
  };

  const severityColor =
    selectedDiagnosis.severity === 'critical'
      ? themeColors.danger
      : selectedDiagnosis.severity === 'high'
      ? themeColors.warning
      : themeColors.success;

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { minHeight: touchTargetMinHeight }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.topBarText}>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
            Diagnóstico Fitossanitário IA
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            Classificação visual de pragas & prescrição agronômica
          </Text>
        </View>
      </View>
        {/* Photo Input Controls */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.surfaceCard,
              borderColor: highContrastFieldMode ? themeColors.border : themeColors.borderLight,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Captura de Imagem na Lavoura
          </Text>
          <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
            Aponte a câmera para folhas com sintomas ou lesões de insetos mastigadores.
          </Text>

          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                style={[styles.removeImageBtn, { backgroundColor: themeColors.danger }]}
              >
                <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handlePickFromCamera}
                style={[
                  styles.captureBtn,
                  {
                    backgroundColor: themeColors.primaryVibrant,
                    minHeight: touchTargetMinHeight,
                  },
                ]}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
                <Text style={styles.captureBtnText}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePickFromGallery}
                style={[
                  styles.captureBtnSecondary,
                  {
                    borderColor: themeColors.border,
                    minHeight: touchTargetMinHeight,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={20}
                  color={themeColors.textPrimary}
                />
                <Text style={[styles.captureBtnSecondaryText, { color: themeColors.textPrimary }]}>
                  Galeria
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Sample Selector */}
          <Text style={[styles.sampleLabel, { color: themeColors.textMuted }]}>
            Ou teste com amostras do catálogo:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sampleScroll}>
            {PEST_CATALOG.map((sample) => {
              const isSelected = sample.pestId === selectedDiagnosis.pestId;
              return (
                <TouchableOpacity
                  key={sample.pestId}
                  onPress={() => handleSelectSample(sample)}
                  style={[
                    styles.samplePill,
                    {
                      backgroundColor: isSelected
                        ? themeColors.primaryVibrant
                        : themeColors.surfaceHighlight,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.samplePillText,
                      { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                    ]}
                  >
                    {sample.commonName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Diagnosis Result Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.surfaceCard,
              borderColor: highContrastFieldMode ? themeColors.border : themeColors.borderLight,
            },
          ]}
        >
          <View style={styles.diagnosisHeader}>
            <View style={styles.titleColumn}>
              <Text style={[styles.pestName, { color: themeColors.textPrimary }]}>
                {selectedDiagnosis.commonName}
              </Text>
              <Text style={[styles.scientificName, { color: themeColors.textMuted }]}>
                {selectedDiagnosis.scientificName}
              </Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
              <Text style={styles.severityText}>
                {selectedDiagnosis.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>
                {language === 'en' ? 'AI Confidence' : 'Confiança IA'}
              </Text>
              <Text style={[styles.metricValue, { color: themeColors.success }]}>
                {selectedDiagnosis.confidencePercent}%
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>
                {language === 'en' ? 'Target Crop' : 'Cultura Alvo'}
              </Text>
              <Text style={[styles.metricValue, { color: themeColors.textPrimary }]}>
                {selectedDiagnosis.cropType === 'Soja'
                  ? (language === 'en' ? 'Soybeans' : 'Soja')
                  : selectedDiagnosis.cropType === 'Milho'
                  ? (language === 'en' ? 'Corn' : 'Milho')
                  : selectedDiagnosis.cropType === 'Café'
                  ? (language === 'en' ? 'Coffee' : 'Café')
                  : selectedDiagnosis.cropType}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>
                {language === 'en' ? 'Urgency Window' : 'Janela Limite'}
              </Text>
              <Text style={[styles.metricValue, { color: themeColors.danger }]}>
                {selectedDiagnosis.urgencyHours}h
              </Text>
            </View>
          </View>

          {/* Symptoms */}
          <Text style={[styles.subHeading, { color: themeColors.textPrimary }]}>
            {language === 'en' ? 'Identified Symptoms:' : 'Sintomatologia Identificada:'}
          </Text>
          {selectedDiagnosis.symptoms.map((symptom, idx) => (
            <View key={idx} style={styles.symptomRow}>
              <MaterialCommunityIcons name="check-circle" size={16} color={themeColors.success} />
              <Text style={[styles.symptomText, { color: themeColors.textSecondary }]}>
                {symptom}
              </Text>
            </View>
          ))}

          {/* Agronomic Prescription */}
          <View
            style={[
              styles.prescriptionBox,
              {
                backgroundColor: themeColors.surfaceHighlight,
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            <View style={styles.rxHeader}>
              <MaterialCommunityIcons
                name="prescription"
                size={20}
                color={themeColors.primaryVibrant}
              />
              <Text style={[styles.rxTitle, { color: themeColors.primaryVibrant }]}>
                Prescrição Fitossanitária (MIP)
              </Text>
            </View>
            <Text style={[styles.rxIngredient, { color: themeColors.textPrimary }]}>
              {selectedDiagnosis.activeIngredientRecommendation}
            </Text>
            <Text style={[styles.rxDosage, { color: themeColors.textSecondary }]}>
              Dose: {selectedDiagnosis.recommendedDosagePerHectare} | Calda: {selectedDiagnosis.sprayVolumeLHa}
            </Text>
            <Text style={[styles.rxNotes, { color: themeColors.textMuted }]}>
              {selectedDiagnosis.agronomicNotes}
            </Text>
          </View>

          {/* Signature Pad */}
          <SignaturePad
            title="Assinatura Digital do Responsável Técnico"
            onSaveSignature={(svg) => setDigitalSignature(svg)}
            onClearSignature={() => setDigitalSignature(null)}
          />

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleSaveToScouting}
            disabled={isSaved}
            style={[
              styles.actionBtn,
              {
                backgroundColor: isSaved ? themeColors.border : themeColors.primaryVibrant,
                minHeight: touchTargetMinHeight,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isSaved ? 'check' : 'content-save-outline'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionBtnText}>
              {isSaved ? 'Salvo no Monitoramento' : 'Salvar no Monitoramento do Talhão'}
            </Text>
          </TouchableOpacity>
        </View>
    </Screen>
  );
};

