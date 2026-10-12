import React, { useState } from 'react';
import {
  View,
  Text,
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
import { colors, spacing } from '../../../theme';
import { styles } from '../styles/login.styles';

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

