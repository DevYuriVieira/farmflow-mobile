import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { usePreferences } from '../contexts/PreferencesContext';
import { useToast } from '../contexts/ToastContext';
import { triggerHaptic } from '../utils/haptics';
import { seedSimulatedOfflineBatch } from '../services/syncQueue.service';
import { styles } from './styles/agroDevToolsModal.styles';

interface AgroDevToolsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AgroDevToolsModal: React.FC<AgroDevToolsModalProps> = ({ visible, onClose }) => {
  const { isDark, language } = usePreferences();
  const { showSuccess, showError, showInfo } = useToast();

  const [simulatedFrost, setSimulatedFrost] = useState(false);
  const [simulatedSiloHeat, setSimulatedSiloHeat] = useState(false);
  const [simulatedPivotFailure, setSimulatedPivotFailure] = useState(false);

  const handleToggleFrost = async () => {
    await triggerHaptic('warning');
    const newState = !simulatedFrost;
    setSimulatedFrost(newState);
    if (newState) {
      showError(
        language === 'en'
          ? 'ALARM: Frost Risk (-1.5°C) detected in South Sector! Immediate spray blackout.'
          : 'ALERTA: Risco de Geada (-1.5°C) no Setor Sul! Bloqueio de pulverizações ativo.'
      );
    } else {
      showSuccess(language === 'en' ? 'Frost simulation normalized' : 'Simulação de geada normalizada');
    }
  };

  const handleSeedBurst = async () => {
    await triggerHaptic('medium');
    await seedSimulatedOfflineBatch(10);
    showSuccess(
      language === 'en'
        ? 'Burst of 10 concurrent mutations injected into offline queue!'
        : 'Carga de 10 mutações concorrentes injetada na fila offline!'
    );
  };

  const handleToggleSiloHeat = async () => {
    await triggerHaptic('error');
    const newState = !simulatedSiloHeat;
    setSimulatedSiloHeat(newState);
    if (newState) {
      showError(
        language === 'en'
          ? 'CRITICAL IOT: Thermal Cable Silo 01 at 38.5°C (Fermentation risk). Aeration engaged.'
          : 'IOT CRÍTICO: Termometria Silo 01 em 38.5°C (Risco de queima). Aeração ligada.'
      );
    } else {
      showInfo(language === 'en' ? 'Silo temperatures normalized' : 'Temperaturas do silo normalizadas');
    }
  };

  const handleTogglePivotFailure = async () => {
    await triggerHaptic('warning');
    const newState = !simulatedPivotFailure;
    setSimulatedPivotFailure(newState);
    if (newState) {
      showError(
        language === 'en'
          ? 'HYDRAULIC ALARM: Center Pivot 02 pressure dropped to 1.1 Bar (Nozzle rupture).'
          : 'FALHA HIDRÁULICA: Pivô Central 02 caiu para 1.1 Bar (Ruptura de bicos/tubulação).'
      );
    } else {
      showSuccess(language === 'en' ? 'Pivot pressure restored' : 'Pressão do pivô restabelecida');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
          <View style={styles.header}>
            <View style={styles.titleCol}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>DEVTOOLS & TESTBENCH</Text>
              </View>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {language === 'en' ? 'Agro Field Simulator' : 'Simulador de Cenários Agrícolas'}
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                {language === 'en'
                  ? 'Inject edge scenarios and failure boundaries for live demos'
                  : 'Injeção de condições de borda e falhas para demonstração'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={isDark ? '#FFFFFF' : '#94A3B8'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.simulatorCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <MaterialCommunityIcons name="snowflake" size={24} color="#38BDF8" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Frost Alert (-1.5°C)' : 'Alerta de Geada (-1.5°C)'}
                </Text>
                <Text style={styles.cardDesc}>
                  {language === 'en'
                    ? 'Simulates severe night freeze and triggers automated spray blackout'
                    : 'Simula frio severo e bloqueia ordens de pulverização por Delta T'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleFrost}
                style={[styles.actionBtn, simulatedFrost && styles.activePill]}
              >
                <Text style={[styles.actionBtnText, simulatedFrost && styles.activePillText]}>
                  {simulatedFrost ? (language === 'en' ? 'Active' : 'Ativo') : (language === 'en' ? 'Test' : 'Testar')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simulatorCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#22C55E" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Burst 10 Offline Mutations' : 'Carga 10 Mutações Concorrentes'}
                </Text>
                <Text style={styles.cardDesc}>
                  {language === 'en'
                    ? 'Populates the transactional FIFO queue with spray, machinery, and IoT events'
                    : 'Enfileira 10 eventos simultâneos para teste de drenagem em lote'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleSeedBurst} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>
                  {language === 'en' ? '+10 Items' : '+10 Itens'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simulatorCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <MaterialCommunityIcons name="fire" size={24} color="#EF4444" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Silo Grain Hotspot (38.5°C)' : 'Superaquecimento de Silo'}
                </Text>
                <Text style={styles.cardDesc}>
                  {language === 'en'
                    ? 'Simulates grain mass fermentation spike and triggers IoT ventilation'
                    : 'Simula bolsa de calor na massa de grãos e dispara exaustores'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleSiloHeat}
                style={[styles.actionBtn, simulatedSiloHeat && styles.activePill]}
              >
                <Text style={[styles.actionBtnText, simulatedSiloHeat && styles.activePillText]}>
                  {simulatedSiloHeat ? (language === 'en' ? 'Hot' : 'Crítico') : (language === 'en' ? 'Test' : 'Testar')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simulatorCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <MaterialCommunityIcons name="water-pump" size={24} color="#F59E0B" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Center Pivot Pressure Drop' : 'Queda de Pressão em Pivô'}
                </Text>
                <Text style={styles.cardDesc}>
                  {language === 'en'
                    ? 'Simulates nozzle line rupture on end-tower pressure transducer'
                    : 'Simula despressurização hidráulica na última torre de irrigação'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleTogglePivotFailure}
                style={[styles.actionBtn, simulatedPivotFailure && styles.activePill]}
              >
                <Text style={[styles.actionBtnText, simulatedPivotFailure && styles.activePillText]}>
                  {simulatedPivotFailure ? (language === 'en' ? 'Leak' : 'Vazamento') : (language === 'en' ? 'Test' : 'Testar')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
