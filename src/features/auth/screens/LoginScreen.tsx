import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loginSchema, LoginFormData } from '../schemas/auth.schemas';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { googleAuthService } from '../../../services/integrations/googleAuth.service';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';
import { AnimatedFarmBackground } from '../../../components/AnimatedFarmBackground';
import { TextField } from '../../../components/TextField';
import { Button } from '../../../components/Button';
import { AuthStackParamList } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const { showError, showInfo } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data);
    } catch (err) {
      showError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@farmflow.ag');
    setValue('password', '123456');
    showInfo('Credenciais de demonstração preenchidas!');
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleAuthService.promptSignIn();
    } catch (err) {
      showError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedFarmBackground variant="full" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="sprout" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>FarmFlow</Text>
            <Text style={styles.subtitle}>Gestão de safras, talhões e operações no campo</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na Conta</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="E-mail"
                  placeholder="produtor@fazenda.com.br"
                  leftIcon="email-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Senha"
                  placeholder="••••••••"
                  leftIcon="lock-outline"
                  isPassword
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <Button
              title="Acessar Plataforma"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              size="lg"
              variant="primary"
              style={styles.submitBtn}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleFillDemo}
              style={styles.demoBadge}
            >
              <MaterialCommunityIcons name="key-outline" size={16} color={colors.accentLime} />
              <Text style={styles.demoBadgeText}>Usar Acesso Demonstração (demo@farmflow.ag)</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Continuar com Google"
              onPress={handleGoogleSignIn}
              variant="secondary"
              leftIcon={<MaterialCommunityIcons name="google" size={18} color={colors.textPrimary} />}
              style={styles.googleBtn}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Ainda não possui cadastro? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Criar Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(16, 40, 27, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(74, 138, 98, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.3)',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  demoBadgeText: {
    ...typography.micro,
    color: colors.accentLime,
    fontWeight: '600',
    marginLeft: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.micro,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },
  googleBtn: {
    marginBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '700',
  },
});
