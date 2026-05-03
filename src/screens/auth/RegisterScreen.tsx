import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppText } from '../../components/common/AppText';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAuthApi } from '../../hooks/useAuthApi';
import { Colors } from '../../theme/colors';

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.username.trim()) errors.username = 'Username is required';
  else if (form.username.length < 3)
    errors.username = 'Minimum 3 characters';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6)
    errors.password = 'Minimum 6 characters';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm password';
  else if (form.confirmPassword !== form.password)
    errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { register, isLoading } = useAuthApi();

  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    ) as typeof touched;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    if(result) router.replace('/login');
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.scroll} safeArea>
      {/* Header */}
      <View className="mb-8">
        <AppText variant="h1" style={styles.heading}>
          Create account ✨
        </AppText>
        <AppText variant="bodyLg" color={Colors.textSecondary}>
          Start your learning journey today
        </AppText>
      </View>

      <AppInput
        label="Username"
        leftIcon="person-outline"
        placeholder="johndoe"
        value={form.username}
        onChangeText={set('username')}
        onBlur={blur('username')}
        error={touched.username ? errors.username : undefined}
      />

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

      <AppInput
        label="Confirm Password"
        leftIcon="lock-closed-outline"
        placeholder="••••••••"
        isPassword
        value={form.confirmPassword}
        onChangeText={set('confirmPassword')}
        onBlur={blur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
      />

      <AppButton
        label="Create Account"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.btn}
      />

      <View className="flex-row justify-center items-center mt-6">
        <AppText variant="body" color={Colors.textSecondary}>
          Already have an account?{' '}
        </AppText>
        <TouchableOpacity onPress={() => router.back()}>
          <AppText variant="label" color={Colors.primary}>
            Sign In
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
  },
  heading: { marginBottom: 6 },
  btn: { marginTop: 8 },
});