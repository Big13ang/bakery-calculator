import { View } from 'react-native';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: keyof typeof Icons;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({ title, description, icon = 'Package', actionLabel, onAction }: EmptyStateProps) => {
    const IconComponent = Icons[icon];

    return (
        <View className="flex-1 items-center justify-center p-8 gap-8">
            {/* Visual Decoration */}
            <View className="relative items-center justify-center">
                {/* Multi-layered Background */}
                <View className="absolute w-32 h-32 bg-bakery-accent/5 rounded-full scale-110" />
                <View className="absolute w-32 h-32 bg-bakery-accent/10 rounded-full scale-100" />
                <View className="w-24 h-24 bg-white shadow-xl shadow-bakery-accent/20 rounded-[32px] items-center justify-center border border-bakery-accent/10">
                    <IconComponent size={42} color="#D97706" />
                </View>

                {/* Floating Dots Decoration */}
                <View className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-bakery-accent opacity-20" />
                <View className="absolute -bottom-1 -left-4 w-3 h-3 rounded-full bg-bakery-accent opacity-10" />
            </View>

            <View className="items-center gap-3 max-w-[280px]">
                <Typography variant="h2" className="text-center text-bakery-text font-display text-xl">{title}</Typography>
                <Typography variant="body" className="text-center text-bakery-text/60 leading-6 text-sm">
                    {description}
                </Typography>
            </View>

            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    label={actionLabel}
                    onPress={onAction}
                    className="min-w-[200px] h-14 rounded-2xl shadow-lg shadow-bakery-accent/30"
                />
            )}
        </View>
    );
};
