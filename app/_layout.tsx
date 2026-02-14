import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SQLiteWrapper } from '@/wrappers/SQLite';
import { ThemeWrapper } from '@/wrappers/Theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SQLiteWrapper>
      <ThemeWrapper>
        <Stack>
          <Stack.Screen name="(tabs)" options={
            {
              headerShown: false
            }
          } />
          <Stack.Screen name="modal" options={
            {
              presentation: 'modal',
              title: 'Modal'
            }
          } />
        </Stack>
        <StatusBar style="auto" />
      </ThemeWrapper>
    </SQLiteWrapper >
  );
}
