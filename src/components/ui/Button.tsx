import * as Haptics from 'expo-haptics';
import React, { memo, ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { cn } from '../../utils';
import { Typography } from './Typography';

interface ButtonProps extends PressableProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    label?: string;
    icon?: ReactNode;
    loading?: boolean;
    className?: string;
}

export const Button = memo(({
    variant = 'primary',
    size = 'md',
    label,
    icon,
    loading,
    className,
    children,
    ...props
}: ButtonProps) => {
    const isPressed = useSharedValue(0);
    const baseStyles = 'flex-row items-center justify-center rounded-2xl';

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

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(isPressed.value ? 0.96 : 1, { damping: 15, stiffness: 300 }) }],
            opacity: withTiming(isPressed.value ? (variant === 'ghost' ? 0.6 : 0.9) : 1, { duration: 100 }),
        };
    });

    const handlePressIn = (e: any) => {
        isPressed.value = 1;
        if (process.env.EXPO_OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        isPressed.value = 0;
        props.onPressOut?.(e);
    };

    return (
        <Pressable
            disabled={loading || props.disabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            {...props}
        >
            <Animated.View
                className={cn(baseStyles, variants[variant], sizes[size], className, "gap-2")}
                style={animatedStyle}
            >
                {loading ? (
                    <ActivityIndicator color={variant === 'primary' ? 'white' : '#4A3728'} />
                ) : (
                    <>
                        {icon && <View>{icon}</View>}
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
            </Animated.View>
        </Pressable>
    );
});
