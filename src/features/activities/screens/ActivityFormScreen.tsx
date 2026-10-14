import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  activitySchema,
  ActivityFormData,
  activityTypeValues,
} from '../schemas/activity.schemas';
import { ActivityType } from '../../../types/activity.types';
import { useCreateActivity, useUpdateActivity } from '../hooks/useActivities';
import { useFarms } from '../../farms/hooks/useFarms';
import { usePlantations } from '../../plantations/hooks/usePlantations';
import { AppDrawerParamList } from '../../../navigation/types';
import { usePreferences } from '../../../contexts/PreferencesContext';

import { Screen } from '../../../components/Screen';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme';
import { styles } from '../styles/activityForm.styles';

import { getActivityTypeLabel, getFarmDisplayName, getPlantationName } from '../../../utils/formatters';

type RouteProps = RouteProp<AppDrawerParamList, 'ActivityForm'>;

export const ActivityFormScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { isDark, language } = usePreferences();
  const activityToEdit = route.params?.activity;

  const isEditing = Boolean(activityToEdit?.id);
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Activities');
    }
  };

  const { data: farms } = useFarms();
  const { data: plantations } = usePlantations();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      farmId: activityToEdit?.farmId || farms?.[0]?.id || '',
      plantationId: activityToEdit?.plantationId || '',
      title: activityToEdit?.title || '',
      description: activityToEdit?.description || '',
      type: activityToEdit?.type || 'IRRIGATION',
      scheduledAt:
        activityToEdit?.scheduledAt ||
        new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    },
  });

  const selectedFarmId = watch('farmId');
  const availablePlantations = plantations?.filter((p) => p.farmId === selectedFarmId);

  const onSubmit = async (data: ActivityFormData) => {
    try {
      if (isEditing && activityToEdit?.id) {
        await updateMutation.mutateAsync({
          id: activityToEdit.id,
          ...data,
          plantationId: data.plantationId || undefined,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          plantationId: data.plantationId || undefined,
        });
      }
      handleBack();
    } catch {
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Screen scrollable>
      <View style={[styles.header, isDark && { backgroundColor: '#0B1410' }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backBtn, isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' }]}
          accessibilityLabel={language === 'en' ? 'Back' : 'Voltar'}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && { color: '#FFFFFF' }]}>
          {language === 'en'
            ? isEditing ? 'Edit Activity' : 'Schedule Activity'
            : isEditing ? 'Editar Atividade' : 'Agendar Atividade'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, isDark && { backgroundColor: '#14231B', borderColor: 'rgba(74, 138, 98, 0.4)' }]}>
          <Text style={[styles.sectionLabel, isDark && { color: '#CBD5E1' }]}>
            {language === 'en' ? 'Farm / Property' : 'Propriedade'}
          </Text>
          <Controller
            control={control}
            name="farmId"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipsRow}>
                {farms?.map((farm) => {
                  const isSelected = farm.id === value;
                  return (
                    <TouchableOpacity
                      key={farm.id}
                      activeOpacity={0.7}
                      onPress={() => onChange(farm.id)}
                      style={[
                        styles.chip,
                        isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
                        isSelected && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark && { color: '#E2E8F0' },
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {getFarmDisplayName(farm, language)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          {errors.farmId && <Text style={styles.errorText}>{errors.farmId.message}</Text>}

          {availablePlantations && availablePlantations.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, isDark && { color: '#CBD5E1' }]}>
                {language === 'en' ? 'Field / Plantation (Optional)' : 'Talhão (Opcional)'}
              </Text>
              <Controller
                control={control}
                name="plantationId"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.chipsRow}>
                    <TouchableOpacity
                      onPress={() => onChange('')}
                      style={[
                        styles.chip,
                        isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
                        !value && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark && { color: '#E2E8F0' },
                          !value && styles.chipTextActive,
                        ]}
                      >
                        {language === 'en' ? 'General Farm' : 'Geral da Fazenda'}
                      </Text>
                    </TouchableOpacity>
                    {availablePlantations.map((p) => {
                      const isSelected = p.id === value;
                      return (
                        <TouchableOpacity
                          key={p.id}
                          onPress={() => onChange(p.id)}
                          style={[
                            styles.chip,
                            isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
                            isSelected && styles.chipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isDark && { color: '#E2E8F0' },
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {getPlantationName(p, language)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </>
          )}

          <Text style={[styles.sectionLabel, isDark && { color: '#CBD5E1' }]}>
            {language === 'en' ? 'Management Type' : 'Tipo de Manejo'}
          </Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipsRow}>
                {activityTypeValues.map((type: ActivityType) => {
                  const isSelected = type === value;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => onChange(type)}
                      style={[
                        styles.chip,
                        isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
                        isSelected && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isDark && { color: '#E2E8F0' },
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {getActivityTypeLabel(type, language)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={language === 'en' ? 'Activity Title' : 'Título da Atividade'}
                placeholder={language === 'en' ? 'e.g. Morning pivot irrigation' : 'Ex: Irrigação matinal do pivô 02'}
                leftIcon="clipboard-text-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={language === 'en' ? 'Detailed Description & Instructions' : 'Descrição Detalhada e Instruções'}
                placeholder={
                  language === 'en'
                    ? 'e.g. Apply 8mm water depth and inspect nozzle pressure...'
                    : "Ex: Aplicar lâmina d'água de 8mm e checar pressão dos bicos..."
                }
                leftIcon="text"
                multiline
                numberOfLines={3}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.description?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="scheduledAt"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={language === 'en' ? 'Scheduled Date & Time (ISO or Format)' : 'Data e Horário Previsto (ISO ou Formato)'}
                placeholder="Ex: 2026-10-10T08:00:00Z"
                leftIcon="clock-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.scheduledAt?.message}
              />
            )}
          />

          <Button
            title={
              isEditing
                ? (language === 'en' ? 'Save Changes' : 'Salvar Alterações')
                : (language === 'en' ? 'Schedule Activity' : 'Agendar Atividade')
            }
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

