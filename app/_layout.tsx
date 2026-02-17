import { Lalezar_400Regular, useFonts } from '@expo-google-fonts/lalezar';
import {
  Vazirmatn_400Regular,
  Vazirmatn_700Bold
} from '@expo-google-fonts/vazirmatn';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, I18nManager } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { AppProvider } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SQLiteProvider } from 'expo-sqlite';

// Force RTL for Persian support
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const DATABASE_NAME = 'tasks';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Lalezar: Lalezar_400Regular,
    Vazirmatn: Vazirmatn_400Regular,
    'Vazirmatn-Regular': Vazirmatn_400Regular,
    'Vazirmatn-Bold': Vazirmatn_700Bold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SQLiteProvider>
        </Suspense>
      </AppProvider>
    </SafeAreaProvider>
  );
}
