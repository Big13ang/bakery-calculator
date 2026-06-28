import React, { memo } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { cn } from '../../utils';
import { Icons } from './Icons';

interface SearchInputProps extends Omit<TextInputProps, 'onChangeText'> {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    containerClassName?: string;
}

export const SearchInput = memo(({
    value,
    onChangeText,
    placeholder = 'جستجو...',
    containerClassName,
    className,
    ...props
}: SearchInputProps) => {
    return (
        <View className={cn("relative h-[52px] justify-center", containerClassName)}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                className={cn(
                    "w-full h-full pr-11 pl-11 rounded-2xl bg-bakery-soft border border-bakery-border font-body text-bakery-text text-sm text-right",
                    className
                )}
                placeholderTextColor="#4A372880"
                {...props}
            />
            
            {/* Search Icon on the right */}
            <View className="absolute right-4 self-center pointer-events-none">
                <Icons.Search size={18} color="#4A3728" className="opacity-50" />
            </View>

            {/* Clear Button on the left */}
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText('')}
                    activeOpacity={0.7}
                    className="absolute left-4 p-1.5 rounded-full bg-bakery-border/30 active:bg-bakery-border/50"
                >
                    <Icons.X size={12} color="#4A3728" />
                </TouchableOpacity>
            )}
        </View>
    );
});

SearchInput.displayName = 'SearchInput';
