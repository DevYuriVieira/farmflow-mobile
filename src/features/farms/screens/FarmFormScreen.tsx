import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { farmSchema, FarmFormData } from '../schemas/farm.schemas';
import { useCreateFarm, useUpdateFarm } from '../hooks/useFarms';
import { AppDrawerParamList } from '../../../navigation/types';
import { usePreferences } from '../../../contexts/PreferencesContext';

import { Screen } from '../../../components/Screen';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { colors, radii, spacing, typography } from '../../../theme';

type FormRouteProps = RouteProp<AppDrawerParamList, 'FarmForm'>;

export const FarmFormScreen: React.FC = () => {
  const route = useRoute<FormRouteProps>();
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const farmToEdit = route.params?.farm;

  const isEditing = Boolean(farmToEdit);
  const createMutation = useCreateFarm();
  const updateMutation = useUpdateFarm();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Farms');
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: farmToEdit?.name || '',
      location: farmToEdit?.location || '',
      totalAreaHectares: farmToEdit?.totalAreaHectares || 100,
      latitude: farmToEdit?.coordinates.latitude || -21.1767,
      longitude: farmToEdit?.coordinates.longitude || -47.8208,
    },
  });

  const onSubmit = async (data: FarmFormData) => {
    try {
      if (isEditing && farmToEdit) {
        await updateMutation.mutateAsync({
          id: farmToEdit.id,
          name: data.name,
          location: data.location,
          totalAreaHectares: data.totalAreaHectares,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          location: data.location,
          totalAreaHectares: data.totalAreaHectares,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        });
      }
      handleBack();
    } catch {
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const setLocationPreset = (name: string, loc: string, lat: number, lng: number) => {
    setValue('name', name);
    setValue('location', loc);
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {isEditing
            ? language === 'en' ? 'Edit Farm' : 'Editar Fazenda'
            : language === 'en' ? 'Register Farm' : 'Cadastrar Fazenda'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Nome da Propriedade"
                placeholder="Ex: Fazenda Santa Fé"
                leftIcon="home-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Município / Estado"
                placeholder="Ex: Ribeirão Preto, SP"
                leftIcon="map-marker-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.location?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="totalAreaHectares"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Área Total (Hectares)"
                placeholder="Ex: 450"
                leftIcon="vector-square"
                keyboardType="numeric"
                value={value !== undefined ? String(value) : ''}
                onBlur={onBlur}
                onChangeText={(txt) => {
                  const num = parseFloat(txt.replace(',', '.'));
                  onChange(isNaN(num) ? 0 : num);
                }}
                error={errors.totalAreaHectares?.message}
              />
            )}
          />

          <View style={styles.coordsRow}>
            <View style={styles.coordCol}>
              <Controller
                control={control}
                name="latitude"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Latitude"
                    placeholder="-21.1767"
                    leftIcon="crosshairs-gps"
                    keyboardType="numeric"
                    value={value !== undefined ? String(value) : ''}
                    onBlur={onBlur}
                    onChangeText={(txt) => {
                      const num = parseFloat(txt.replace(',', '.'));
                      onChange(isNaN(num) ? 0 : num);
                    }}
                    error={errors.latitude?.message}
                  />
                )}
              />
            </View>

            <View style={styles.coordCol}>
              <Controller
                control={control}
                name="longitude"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Longitude"
                    placeholder="-47.8208"
                    leftIcon="crosshairs-gps"
                    keyboardType="numeric"
                    value={value !== undefined ? String(value) : ''}
                    onBlur={onBlur}
                    onChangeText={(txt) => {
                      const num = parseFloat(txt.replace(',', '.'));
                      onChange(isNaN(num) ? 0 : num);
                    }}
                    error={errors.longitude?.message}
                  />
                )}
              />
            </View>
          </View>

          <Text style={styles.presetLabel}>Regiões Agrícolas Sugeridas:</Text>
          <View style={styles.presetsWrap}>
            <TouchableOpacity
              onPress={() => setLocationPreset('Fazenda Boa Esperança', 'Rio Verde, GO', -17.7925, -50.9192)}
              style={styles.presetChip}
            >
              <Text style={styles.presetChipText}>Rio Verde, GO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLocationPreset('Fazenda Terra Forte', 'Cascavel, PR', -24.9578, -53.4595)}
              style={styles.presetChip}
            >
              <Text style={styles.presetChipText}>Cascavel, PR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLocationPreset('Fazenda Primavera', 'Sorriso, MT', -12.5428, -55.7214)}
              style={styles.presetChip}
            >
              <Text style={styles.presetChipText}>Sorriso, MT</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={isEditing ? 'Salvar Alterações' : 'Cadastrar Fazenda'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            size="lg"
            variant="primary"
            style={styles.submitBtn}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: spacing.md,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  content: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    padding: spacing.xl,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordCol: {
    flex: 0.48,
  },
  presetLabel: {
    ...typography.micro,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  presetChip: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  presetChipText: {
    ...typography.micro,
    color: colors.primaryLight,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});
