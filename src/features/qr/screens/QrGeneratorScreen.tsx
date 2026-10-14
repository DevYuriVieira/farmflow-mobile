import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '../../../components/Screen';
import { Button } from '../../../components/Button';
import { AppDrawerParamList } from '../../../navigation/types';
import { colors } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/qrGenerator.styles';

type RouteProps = RouteProp<AppDrawerParamList, 'QrGenerator'>;

export const QrGeneratorScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const { entityType, id, name } = route.params;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  const payload = JSON.stringify({ type: entityType, id });

  const handleShareCode = async () => {
    try {
      await Share.share({
        title: `QR Code FarmFlow - ${name}`,
        message: `Código QR do ${entityType === 'farm' ? 'Fazenda' : 'Talhão'}: ${name}\nID: ${id}\nPayload: ${payload}`,
      });
    } catch {
    }
  };

  return (
    <Screen>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {language === 'en' ? 'QR Code Identifier' : 'Identificador QR'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.entityTypeBadge}>
            {entityType === 'farm' ? 'PROPRIEDADE RURAL' : 'TALHÃO AGRÍCOLA'}
          </Text>
          <Text style={styles.entityName}>{name}</Text>
          <Text style={styles.entityIdText}>Código: {id}</Text>

          <View style={styles.qrWrapper}>
            <QRCode
              value={payload}
              size={210}
              color="#07150E"
              backgroundColor="#FFFFFF"
            />
          </View>

          <Text style={styles.qrInstructions}>
            Imprima ou fixe este código nas placas do lote para identificação rápida via leitor mobile.
          </Text>

          <Button
            title="Compartilhar Identificador"
            onPress={handleShareCode}
            leftIcon={<MaterialCommunityIcons name="share-variant-outline" size={18} color={colors.textInverse} />}
            variant="primary"
            style={styles.shareBtn}
          />
        </View>
      </View>
    </Screen>
  );
};

