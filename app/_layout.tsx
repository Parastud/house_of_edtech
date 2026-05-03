import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { OfflineBanner } from '../src/components/common/OfflineBanner';
import { SnackBar } from '../src/components/common/SnackBar';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { useAppActiveTracker, useNotifications } from '../src/hooks/useNotifications';
import { store } from '../src/redux/store';


// ─── Inner layout — has access to Redux store ─────────────────────────────────
const RootLayoutInner = () => {

  useNetworkStatus();
  useNotifications();
  useAppActiveTracker();

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
      <SnackBar />
      <OfflineBanner />
    </>
  );
};

// ─── Root layout — provides Redux + SafeArea ─────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
          <ErrorBoundary>
            <RootLayoutInner />
          </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
}