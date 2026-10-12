import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { SprayApplication } from '../types';
import { useSpraying, calculateDriftRisk } from '../hooks/useSpraying';
import { styles } from '../styles/sprayDiary.styles';
import { Screen } from '../../../components/Screen';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';

export const SprayDiaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const {
    applications,
    isLoading,
    inGraceCount,
    safeCount,
    addApplication,
    deleteApplication,
  } = useSpraying();

  const [modalVisible, setModalVisible] = useState(false);

  const [plantationName, setPlantationName] = useState('Talhão 02 — Milho Safrinha');
  const [targetPest, setTargetPest] = useState('Cigarrinha & Lagarta');
  const [productName, setProductName] = useState('Connect + Belt');
  const [activeIngredient, setActiveIngredient] = useState('Flubendiamida + Beta-ciflutrina');
  const [dosePerHectare, setDosePerHectare] = useState('0.4 L/ha');
  const [sprayVolume, setSprayVolume] = useState('120');
  const [treatedArea, setTreatedArea] = useState('30');
  const [nozzleType, setNozzleType] = useState('Indução de Ar AIXR 11002');
  const [graceDays, setGraceDays] = useState('14');
  const [tempC, setTempC] = useState('24');
  const [humidity, setHumidity] = useState('65');
  const [windKmH, setWindKmH] = useState('6');
  const [operatorName, setOperatorName] = useState('Operador Fazenda');
  const [notes, setNotes] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const handleSave = async () => {
    const wind = parseFloat(windKmH) || 5;
    const hum = parseFloat(humidity) || 60;
    const temp = parseFloat(tempC) || 25;
    const driftRisk = calculateDriftRisk(wind, hum, temp);

    await addApplication({
      farmId: 'farm-1',
      plantationName,
      targetPest,
      productName,
      activeIngredient,
      dosePerHectare,
      sprayVolumeLPerHa: parseFloat(sprayVolume) || 120,
      totalTreatedAreaHa: parseFloat(treatedArea) || 20,
      nozzleType,
      appliedAt: new Date().toISOString(),
      withdrawalPeriodDays: parseInt(graceDays, 10) || 7,
      temperatureC: temp,
      humidityPercent: hum,
      windSpeedKmH: wind,
      driftRisk,
      operatorName,
      notes,
    });

    setModalVisible(false);
  };

  const getDaysRemaining = (safeDateStr: string) => {
    const diff = new Date(safeDateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const renderItem: ListRenderItem<SprayApplication> = ({ item }) => {
    const daysLeft = getDaysRemaining(item.harvestSafeDate);
    const isGrace = item.status === 'IN_GRACE_PERIOD' && daysLeft > 0;

    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.productName}</Text>
            <Text style={[styles.cardSubtitle, isDark && styles.cardSubtitleDark]}>
              {item.plantationName} · {item.targetPest}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isGrace ? styles.graceBadge : styles.safeBadge,
              isDark && (isGrace ? styles.graceBadgeDark : styles.safeBadgeDark),
            ]}
          >
            <MaterialCommunityIcons
              name={isGrace ? 'shield-alert-outline' : 'shield-check-outline'}
              size={14}
              color={isGrace ? '#EF4444' : '#10B981'}
            />
            <Text style={[styles.statusBadgeText, { color: isGrace ? '#EF4444' : '#10B981' }]}>
              {isGrace
                ? (language === 'en' ? `Grace: ${daysLeft}d left` : `Carência: ${daysLeft}d restantes`)
                : (language === 'en' ? 'Cleared for Harvest' : 'Liberado p/ Colheita')}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Active Ingredient' : 'Ingrediente Ativo'}
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]} numberOfLines={1}>
              {item.activeIngredient}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Dose / Volume' : 'Dose / Calda'}
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {item.dosePerHectare} · {item.sprayVolumeLPerHa} L/ha
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Spray Nozzle' : 'Ponta de Pulverização'}
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]} numberOfLines={1}>
              {item.nozzleType}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>
              {language === 'en' ? 'Application Weather' : 'Condições de Aplicação'}
            </Text>
            <Text style={[styles.infoVal, isDark && styles.infoValDark]}>
              {item.windSpeedKmH} km/h · {item.humidityPercent}% RH · {item.temperatureC}°C
            </Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={[styles.notesText, isDark && styles.notesTextDark]}>{item.notes}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <Text style={[styles.dateText, isDark && styles.dateTextDark]}>
            {language === 'en' ? 'Applied on ' : 'Aplicado em '}
            {new Date(item.appliedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')} · {item.operatorName}
          </Text>

          <TouchableOpacity
            onPress={() => deleteApplication(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <LoadingState
        message={
          language === 'en'
            ? 'Loading spray diary...'
            : 'Carregando caderno de pulverização...'
        }
      />
    );
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
                {language === 'en' ? 'Spray Diary & MAPA Grace' : 'Caderno de Pulverização'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en' ? 'Pesticide tracking & safety intervals' : 'Intervalo de segurança e compliance MAPA'}
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
            accessibilityLabel="Nova Aplicação"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>{inGraceCount}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>
              {language === 'en' ? 'In Grace Period' : 'Em Carência'}
            </Text>
            <Text style={styles.kpiSub}>
              {language === 'en' ? 'Harvest restricted' : 'Colheita restrita'}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#10B981' }]}>{safeCount}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>
              {language === 'en' ? 'Safe to Harvest' : 'Liberados'}
            </Text>
            <Text style={styles.kpiSub}>
              {language === 'en' ? 'No active residue' : 'Sem resíduo ativo'}
            </Text>
          </View>
          <View style={[styles.kpiCard, isDark && styles.kpiCardDark]}>
            <Text style={[styles.kpiNumber, { color: '#3B82F6' }]}>{applications.length}</Text>
            <Text style={[styles.kpiLabel, isDark && styles.kpiLabelDark]}>
              {language === 'en' ? 'Applications' : 'Aplicações'}
            </Text>
            <Text style={styles.kpiSub}>
              {language === 'en' ? 'Current crop' : 'Safra atual'}
            </Text>
          </View>
        </View>

        <View style={[styles.sprayWindowBanner, isDark && styles.sprayWindowBannerDark]}>
          <MaterialCommunityIcons name="weather-windy" size={18} color="#059669" />
          <Text style={[styles.sprayWindowText, isDark && styles.sprayWindowTextDark]}>
            {language === 'en'
              ? 'Ideal Spray Window: Wind 3 to 10 km/h · RH > 55% · Temp < 30°C'
              : 'Janela de Pulverização Ideal: Vento 3 a 10 km/h · UR > 55% · Temp < 30°C'}
          </Text>
        </View>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="spray"
            title={language === 'en' ? 'No Applications Recorded' : 'Nenhuma Aplicação Registrada'}
            description={
              language === 'en'
                ? 'Record crop sprays to monitor safety and withdrawal intervals for each field.'
                : 'Cadastre as pulverizações realizadas para controlar o período de carência de cada talhão.'
            }
          />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Registrar Pulverização</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#1E293B'} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Talhão / Lavoura</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={plantationName}
              onChangeText={setPlantationName}
              placeholder="Ex: Talhão 02 — Milho"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Produto Comercial</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Ex: Fox Xpro"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Alvo (Praga/Doença)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={targetPest}
                  onChangeText={setTargetPest}
                  placeholder="Ex: Ferrugem"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Dose por Hectare</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  value={dosePerHectare}
                  onChangeText={setDosePerHectare}
                  placeholder="Ex: 0.5 L/ha"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Carência (Dias)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={graceDays}
                  onChangeText={setGraceDays}
                  placeholder="Ex: 14"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Volume Calda (L/ha)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={sprayVolume}
                  onChangeText={setSprayVolume}
                  placeholder="120"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Área Total (ha)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={treatedArea}
                  onChangeText={setTreatedArea}
                  placeholder="30"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Ingrediente Ativo</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={activeIngredient}
              onChangeText={setActiveIngredient}
              placeholder="Ex: Trifloxistrobina + Protioconazol"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Ponta de Pulverização</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={nozzleType}
              onChangeText={setNozzleType}
              placeholder="Ex: Jato Plano Indução de Ar (AIXR)"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Vento (km/h)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={windKmH}
                  onChangeText={setWindKmH}
                  placeholder="6"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Temp (°C)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={tempC}
                  onChangeText={setTempC}
                  placeholder="24"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>UR (%)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  keyboardType="numeric"
                  value={humidity}
                  onChangeText={setHumidity}
                  placeholder="65"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Operador / Pulverizador</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={operatorName}
              onChangeText={setOperatorName}
              placeholder="Ex: Carlos Mendes (Uniport 3030)"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.formLabel, isDark && styles.formLabelDark]}>Observações / Calda</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Adicionado adjuvante à calda..."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Gravar no Caderno de Campo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

