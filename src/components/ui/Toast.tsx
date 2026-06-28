import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from './Icons';
import { Typography } from './Typography';
import { ToastProps, TOAST_THEMES } from './toast.config';

export const Toast = ({
    visible,
    message,
    type = 'info',
    onClose,
    duration = 3000
}: ToastProps) => {
    const insets = useSafeAreaInsets();
    const topOffset = insets.top > 0 ? insets.top + 8 : 16;

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: withTiming(visible ? topOffset : -150, { duration: 300 })
        }],
        opacity: withTiming(visible ? 1 : 0, { duration: 250 }),
    }), [visible, topOffset]);

    const theme = TOAST_THEMES[type] || TOAST_THEMES.info;
    const IconComponent = Icons[theme.iconName] || Icons.Package;

    return (
        <Animated.View
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                styles.toastContainer,
                animatedStyle,
                {
                    backgroundColor: theme.bgColor,
                    borderColor: theme.borderColor,
                }
            ]}
            className="flex-row items-center border p-4 mx-4 rounded-2xl shadow-lg"
        >
            <View className="flex-row items-center flex-1 gap-3">
                <View className="p-1.5 rounded-lg bg-white/80">
                    <IconComponent size={20} color={theme.iconColor} />
                </View>
                <Typography variant="body" className="flex-1 text-right text-stone-800 font-medium">
                    {message}
                </Typography>
            </View>
            <Pressable onPress={onClose} className="p-1 ml-2 opacity-50 active:opacity-100">
                <Icons.X size={16} color="#4A3728" />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 9999,
        borderWidth: 1,
        borderCurve: 'continuous',
    }
});
