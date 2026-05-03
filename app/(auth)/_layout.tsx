import { useAppSelector } from '@/src/redux/hook';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthorized, isBootstrapping } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isBootstrapping) return;
    if (isAuthorized) router.replace('/(tabs)');
  }, [isAuthorized, isBootstrapping, router]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}