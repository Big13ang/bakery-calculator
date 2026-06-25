import React, { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../utils';

interface CardProps extends ViewProps {
    className?: string;
    variant?: 'default' | 'flat';
}

export const Card = memo(({ className, variant = 'default', children, ...props }: CardProps) => {
    return (
        <View
            className={cn(
                'bg-bakery-card border border-bakery-border rounded-2xl p-5',
                variant === 'default' && 'shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
});

Card.displayName = 'Card';

