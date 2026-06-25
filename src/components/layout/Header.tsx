import React, { memo, ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { cn } from '../../utils';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface HeaderProps {
    title: string;
    onBack?: () => void;
    actionButton?: ReactNode;
    className?: string;
}

export const Header = memo(({ title, onBack, actionButton, className }: HeaderProps) => {
    return (
        <View className={cn("flex-row items-center justify-between p-4 bg-bakery-bg border-b border-bakery-border mb-6 z-40", className)}>
            <View className="flex-row items-center gap-3">
                {onBack && (
                    <TouchableOpacity
                        onPress={onBack}
                        className="p-2 rounded-xl bg-white border border-bakery-border shadow-sm active:scale-95"
                    >
                        <Icons.ChevronRight size={20} color="#4A3728" />
                    </TouchableOpacity>
                )}
                <Typography variant="h2">{title}</Typography>
            </View>
            {actionButton}
        </View>
    );
});

Header.displayName = 'Header';
