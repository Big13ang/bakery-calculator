import { View } from 'react-native';
import { cn } from '../../utils';
import { Typography } from './Typography';

interface BadgeProps {
    label: string;
    subLabel?: string;
    variant?: 'default' | 'accent' | 'danger';
    className?: string;
}

export const Badge = ({ value, label, variant = 'default', className }: { value: string | number; label: string; variant?: 'default' | 'accent' | 'danger' | 'success'; className?: string }) => {
    const styles = {
        default: 'bg-bakery-soft border-bakery-border',
        accent: 'bg-bakery-accent border-bakery-accent',
        danger: 'bg-red-100 border-red-200',
        success: 'bg-green-100 border-green-200',
    };

    const textStyles = {
        default: 'text-bakery-text',
        accent: 'text-white',
        danger: 'text-bakery-danger',
        success: 'text-green-800',
    };

    return (
        <View className={cn("flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg border", styles[variant], className)}>
            <Typography variant="micro" className={cn("opacity-60 text-[8px]", textStyles[variant])}>
                {label}
            </Typography>
            <Typography variant="micro" className={cn("font-black text-[10px]", textStyles[variant])}>
                {value}
            </Typography>
        </View>
    );
};
