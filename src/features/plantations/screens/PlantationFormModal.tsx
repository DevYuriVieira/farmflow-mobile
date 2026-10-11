import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  plantationSchema,
  PlantationFormData,
  cropTypeValues,
  plantationStatusValues,
} from '../schemas/plantation.schemas';
import { Plantation, CropType, PlantationStatus } from '../../../types/plantation.types';
import { useCreatePlantation, useUpdatePlantation } from '../hooks/usePlantations';
import { useFarms } from '../../farms/hooks/useFarms';
import { useToast } from '../../../contexts/ToastContext';

import { AppModal } from '../../../components/AppModal';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { colors, radii, spacing, typography } from '../../../theme';
import { cropTypeLabels, plantationStatusLabels } from '../../../utils/formatters';

export interface PlantationFormModalProps {
  visible: boolean;
  onClose: () => void;
  plantationToEdit?: Plantation;
  defaultFarmId?: string;
}

export const PlantationFormModal: React.FC<PlantationFormModalProps> = ({
  visible,
  onClose,
  plantationToEdit,
  defaultFarmId,
}) => {
  const { data: farms } = useFarms();
  const createMutation = useCreatePlantation();
  const updateMutation = useUpdatePlantation();
  const { showError } = useToast();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    plantationToEdit?.imageUri
  );

  const isEditing = Boolean(plantationToEdit);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PlantationFormData>({
    resolver: zodResolver(plantationSchema),
    defaultValues: {
      farmId: plantationToEdit?.farmId || defaultFarmId || farms?.[0]?.id || '',
      name: plantationToEdit?.name || '',
      cropType: plantationToEdit?.cropType || 'SOY',
      areaHectares: plantationToEdit?.areaHectares || 10,
      status: plantationToEdit?.status || 'PLANNED',
      plantedAt: plantationToEdit?.plantedAt || new Date().toISOString().split('T')[0],
      expectedHarvestAt:
        plantationToEdit?.expectedHarvestAt ||
        new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().split('T')[0],
      imageUri: plantationToEdit?.imageUri,
      notes: plantationToEdit?.notes || '',
    },
  });

  useEffect(() => {
    if (visible) {
      if (plantationToEdit) {
        reset({
          farmId: plantationToEdit.farmId,
          name: plantationToEdit.name,
          cropType: plantationToEdit.cropType,
          areaHectares: plantationToEdit.areaHectares,
          status: plantationToEdit.status,
          plantedAt: plantationToEdit.plantedAt.split('T')[0],
          expectedHarvestAt: plantationToEdit.expectedHarvestAt.split('T')[0],
          imageUri: plantationToEdit.imageUri,
          notes: plantationToEdit.notes || '',
        });
        setSelectedImage(plantationToEdit.imageUri);
      } else {
        const today = new Date().toISOString().split('T')[0];
        const harvest = new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().split('T')[0];
        reset({
          farmId: defaultFarmId || farms?.[0]?.id || '',
          name: '',
          cropType: 'SOY',
          areaHectares: 15,
          status: 'PLANNED',
          plantedAt: today,
          expectedHarvestAt: harvest,
          notes: '',
        });
        setSelectedImage(undefined);
      }
    }
  }, [visible, plantationToEdit, defaultFarmId, farms, reset]);

  const handlePickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permissão Necessária',
          'O acesso à câmera é necessário para fotografar o talhão. Conceda a permissão nas configurações do sistema.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        setValue('imageUri', uri);
      }
    } catch {
      showError('Não foi possível abrir a câmera.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permissão Necessária',
          'O acesso à galeria de fotos é necessário para selecionar a imagem do talhão.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        setValue('imageUri', uri);
      }
    } catch {
      showError('Não foi possível abrir a galeria.');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(undefined);
    setValue('imageUri', undefined);
  };

  const onSubmit = async (data: PlantationFormData) => {
    try {
      if (isEditing && plantationToEdit) {
        await updateMutation.mutateAsync({
          id: plantationToEdit.id,
          ...data,
          imageUri: selectedImage,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          imageUri: selectedImage,
        });
      }
      onClose();
    } catch {
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Editar Talhão' : 'Novo Talhão'}
      subtitle="Cadastre as informações agronômicas do lote"
    >
      <View style={styles.formContainer}>
        <Text style={styles.sectionLabel}>Fazenda Vinculada</Text>
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
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <MaterialCommunityIcons
                      name="home-outline"
                      size={14}
                      color={isSelected ? colors.textInverse : colors.primaryLight}
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {farm.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.farmId && <Text style={styles.fieldError}>{errors.farmId.message}</Text>}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Nome ou Identificação do Talhão"
              placeholder="Ex: Talhão 04 - Soja Safra Verão"
              leftIcon="sprout-outline"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Text style={styles.sectionLabel}>Cultura Agrícola</Text>
        <Controller
          control={control}
          name="cropType"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipsWrap}>
              {cropTypeValues.map((type: CropType) => {
                const isSelected = type === value;
                return (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.7}
                    onPress={() => onChange(type)}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {cropTypeLabels[type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.cropType && <Text style={styles.fieldError}>{errors.cropType.message}</Text>}

        <Controller
          control={control}
          name="areaHectares"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Área do Talhão (Hectares)"
              placeholder="Ex: 25.5"
              leftIcon="vector-square"
              keyboardType="numeric"
              value={value !== undefined ? String(value) : ''}
              onBlur={onBlur}
              onChangeText={(txt) => {
                const num = parseFloat(txt.replace(',', '.'));
                onChange(isNaN(num) ? 0 : num);
              }}
              error={errors.areaHectares?.message}
            />
          )}
        />

        <Text style={styles.sectionLabel}>Estágio Atual da Lavoura</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipsWrap}>
              {plantationStatusValues.map((st: PlantationStatus) => {
                const isSelected = st === value;
                return (
                  <TouchableOpacity
                    key={st}
                    activeOpacity={0.7}
                    onPress={() => onChange(st)}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {plantationStatusLabels[st]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.status && <Text style={styles.fieldError}>{errors.status.message}</Text>}

        <View style={styles.rowTwoCols}>
          <View style={styles.col}>
            <Controller
              control={control}
              name="plantedAt"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Data de Plantio"
                  placeholder="AAAA-MM-DD"
                  leftIcon="calendar"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.plantedAt?.message}
                />
              )}
            />
          </View>
          <View style={styles.col}>
            <Controller
              control={control}
              name="expectedHarvestAt"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Previsão Colheita"
                  placeholder="AAAA-MM-DD"
                  leftIcon="calendar-check"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.expectedHarvestAt?.message}
                />
              )}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Registro Fotográfico do Talhão</Text>
        <View style={styles.imagePickerWrapper}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={handleRemoveImage}
                style={styles.removeImageBadge}
                accessibilityLabel="Remover foto"
              >
                <MaterialCommunityIcons name="delete-outline" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noImagePlaceholder}>
              <MaterialCommunityIcons name="image-outline" size={32} color={colors.textMuted} />
              <Text style={styles.noImageText}>Nenhuma imagem vinculada</Text>
            </View>
          )}

          <View style={styles.imageActionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickFromCamera}
              style={styles.imageActionBtn}
            >
              <MaterialCommunityIcons name="camera-outline" size={18} color={colors.primaryLight} />
              <Text style={styles.imageActionBtnText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickFromGallery}
              style={styles.imageActionBtn}
            >
              <MaterialCommunityIcons name="image-plus" size={18} color={colors.primaryLight} />
              <Text style={styles.imageActionBtnText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Anotações Agronômicas (Opcional)"
              placeholder="Ex: Variável de adubação, histórico fitossanitário..."
              leftIcon="notebook-outline"
              multiline
              numberOfLines={3}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.notes?.message}
            />
          )}
        />

        <View style={styles.actionButtonsRow}>
          <Button
            title="Cancelar"
            onPress={onClose}
            variant="ghost"
            style={styles.cancelBtn}
          />
          <Button
            title={isEditing ? 'Salvar Alterações' : 'Salvar Talhão'}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            variant="primary"
            style={styles.saveBtn}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  fieldError: {
    ...typography.micro,
    color: colors.danger,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  chipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  rowTwoCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 0.48,
  },
  imagePickerWrapper: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.lg,
    borderWidth: 1.2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  imagePreviewContainer: {
    height: 140,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImagePlaceholder: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  noImageText: {
    ...typography.micro,
    color: colors.textMuted,
    marginTop: 4,
  },
  imageActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceCardSolid,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageActionBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    marginLeft: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  cancelBtn: {
    marginRight: spacing.sm,
    minWidth: 100,
  },
  saveBtn: {
    minWidth: 150,
  },
});
