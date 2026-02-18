import { ScrollView, View, ViewProps, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../utils';

interface ScreenProps extends ViewProps {
    scrollable?: boolean;
    className?: string;
    contentContainerStyle?: ViewStyle;
}

export const Screen = ({ scrollable = true, className, children, contentContainerStyle, ...props }: ScreenProps) => {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView className="flex-1 bg-bakery-bg">
            <Container
                className={cn("flex-1", className)}
                contentContainerStyle={scrollable
                    ? { paddingBottom: 100, flexGrow: 1, ...contentContainerStyle }
                    : { flex: 1, ...contentContainerStyle }
                }
                showsVerticalScrollIndicator={false}
                {...props}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};
