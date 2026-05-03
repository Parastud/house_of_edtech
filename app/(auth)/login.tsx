import { AppButton } from '@/src/components/common/AppButton';
import { AppInput } from '@/src/components/common/AppInput';
import { AppText } from '@/src/components/common/AppText';
import { ScreenWrapper } from '@/src/components/common/ScreenWrapper';
import { useAuthApi } from '@/src/hooks/useAuthApi';
import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6)
    errors.password = 'Minimum 6 characters';
  return errors;
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthApi();

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (touched[key]) {
      const errs = validate({ ...form, [key]: val });
      setErrors((e) => ({ ...e, [key]: errs[key] }));
    }
  };

  const blur = (key: keyof FormState) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    const errs = validate(form);
    setErrors((e) => ({ ...e, [key]: errs[key] }));
  };

  const handleSubmit = async () => {
    setTouched({ email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const result = await login({ email: form.email.trim(), password: form.password });
    if (result) router.replace('/(tabs)');
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.scroll} safeArea>
      {/* Header */}
      <View className="mb-8">
        <AppText variant="h1" style={styles.heading}>
          Welcome back 👋
        </AppText>
        <AppText variant="bodyLg" color={Colors.textSecondary}>
          Sign in to continue learning
        </AppText>
      </View>

      {/* Form */}
      <AppInput
        label="Email"
        leftIcon="mail-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        value={form.email}
        onChangeText={set('email')}
        onBlur={blur('email')}
        error={touched.email ? errors.email : undefined}
      />

      <AppInput
        label="Password"
        leftIcon="lock-closed-outline"
        placeholder="••••••••"
        isPassword
        value={form.password}
        onChangeText={set('password')}
        onBlur={blur('password')}
        error={touched.password ? errors.password : undefined}
      />

      <AppButton
        label="Sign In"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.btn}
      />

      {/* Register link */}
      <View className="flex-row justify-center items-center mt-6">
        <AppText variant="body" color={Colors.textSecondary}>
          Don't have an account?{' '}
        </AppText>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <AppText variant="label" color={Colors.primary}>
            Sign Up
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  heading: {
    marginBottom: 6,
  },
  btn: {
    marginTop: 8,
  },
});