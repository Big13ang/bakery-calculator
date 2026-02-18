import { Lalezar_400Regular, useFonts } from '@expo-google-fonts/lalezar';
import {
  Vazirmatn_400Regular,
  Vazirmatn_700Bold
} from '@expo-google-fonts/vazirmatn';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, I18nManager, LogBox, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { AppProvider } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SQLiteProvider } from 'expo-sqlite';

// Force RTL for Persian support
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Configure LogBox to ignore Reanimated warnings
LogBox.ignoreLogs([
  '[Reanimated] Reading from `value` during component render',
  '[Reanimated] Writing to `value` during component render',
]);

const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FDF8F1', // Exact match to bakery-bg
    card: '#FFFFFF',
    text: '#4A3728',
    border: '#D9C4A9',
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#151718',
    card: '#1A1A1A',
    text: '#ECEDEE',
    border: '#2C2C2C',
  },
};

export const DATABASE_NAME = 'bakery_app.db';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

import { runMigrations } from '@/db/client';

// ... (existing imports)

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Lalezar: Lalezar_400Regular,
    Vazirmatn: Vazirmatn_400Regular,
    'Vazirmatn-Regular': Vazirmatn_400Regular,
    'Vazirmatn-Bold': Vazirmatn_700Bold,
  });

  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    async function prepare() {
      try {
        await runMigrations();
        setDbReady(true);
      } catch (e) {
        console.error("Migration failed", e);
      } finally {
        if (fontsLoaded || fontError) {
          SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Suspense fallback={<View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#151718' : '#FDF8F1', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" /></View>}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
            <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'ios_from_right',
                  animationDuration: 400,
                  contentStyle: { backgroundColor: colorScheme === 'dark' ? '#151718' : '#FDF8F1' }
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom'
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SQLiteProvider>
        </Suspense>
      </AppProvider>
    </SafeAreaProvider >
  );
}
