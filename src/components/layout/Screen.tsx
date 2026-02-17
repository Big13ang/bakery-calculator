import { ScrollView, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../utils';

interface ScreenProps extends ViewProps {
    scrollable?: boolean;
    className?: string;
}

export const Screen = ({ scrollable = true, className, children, ...props }: ScreenProps) => {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView className="flex-1 bg-bakery-bg">
            <Container
                className={cn("flex-1", className)}
                contentContainerStyle={scrollable ? { paddingBottom: 100 } : undefined}
                showsVerticalScrollIndicator={false}
                {...props}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};
