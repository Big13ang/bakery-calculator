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
    showShadow?: boolean;
}

export const Header = memo(({ title, onBack, actionButton, className, showShadow = false }: HeaderProps) => {
    return (
        <View
            className={cn("flex-row items-center justify-between p-4 bg-bakery-bg border-b border-bakery-border mb-6 z-40 relative", className)}
        >
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
            {showShadow && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: -15,
                        left: 0,
                        right: 0,
                        height: 15,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            height: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 3,
                            elevation: 4,
                            width: '100%',
                        }}
                    />
                </View>
            )}
        </View>
    );
});

Header.displayName = 'Header';
