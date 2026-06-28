import React, { memo } from 'react';
import { I18nManager, TextInput, TextInputProps, View } from 'react-native';
import { cn } from '../../utils';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
    containerClassName?: string;
    prefixText?: string;
}

export const Input = memo(({ label, containerClassName, className, prefixText, style, ...props }: InputProps) => {
    return (
        <View className={cn("", containerClassName)}>
            {label && (
                <Typography variant="micro" className="opacity-80 pr-1 text-left mb-2">
                    {label}
                </Typography>
            )}
            <View 
                className="relative justify-center" 
                style={prefixText ? { direction: 'ltr' } : undefined}
            >
                <TextInput
                    className={cn(
                        "w-full h-[52px] p-4 rounded-2xl bg-bakery-soft border border-bakery-border font-body text-bakery-text text-sm",
                        prefixText ? "text-left" : "text-right",
                        className
                    )}
                    placeholderTextColor="#4A372880"
                    style={[
                        prefixText
                            ? { paddingRight: 56, paddingLeft: 16 }
                            : {},
                        style
                    ]}
                    {...props}
                />
                {prefixText && (
                    <View 
                        className="absolute" 
                        style={{ right: 16 }}
                    >
                        <Typography variant="body" className="opacity-50 text-sm font-body">
                            {prefixText}
                        </Typography>
                    </View>
                )}
            </View>
        </View>
    );
});

Input.displayName = 'Input';

