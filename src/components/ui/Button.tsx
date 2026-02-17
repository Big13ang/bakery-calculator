import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { cn } from '../../utils';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    label?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    className?: string;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    label,
    icon,
    loading,
    className,
    children,
    ...props
}: ButtonProps) => {
    const baseStyles = 'flex-row items-center justify-center rounded-2xl active:opacity-90 transition-all';

    const variants = {
        primary: 'bg-bakery-accent shadow-md border border-transparent',
        secondary: 'bg-bakery-soft border border-bakery-border',
        danger: 'bg-bakery-soft border border-bakery-border', // Danger usually has specific text color handled in children or specialized prop
        ghost: 'bg-transparent border-none shadow-none',
    };

    const sizes = {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-5',
        icon: 'p-3 aspect-square',
    };

    const textColors = {
        primary: 'text-white',
        secondary: 'text-bakery-text',
        danger: 'text-bakery-danger',
        ghost: 'text-bakery-text',
    };

    return (
        <TouchableOpacity
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#4A3728'} />
            ) : (
                <>
                    {icon && <View className={label ? "ms-2" : ""}>{icon}</View>}
                    {label && (
                        <Typography
                            variant="body"
                            className={cn("font-black text-center", textColors[variant])}
                        >
                            {label}
                        </Typography>
                    )}
                    {children}
                </>
            )}
        </TouchableOpacity>
    );
};
