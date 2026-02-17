import { ReactNode } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import '../../global.css';

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export const ThemeWrapper = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={
            colorScheme === 'dark' ? DarkTheme : DefaultTheme
        }>
            {children}
        </ThemeProvider>
    )
}