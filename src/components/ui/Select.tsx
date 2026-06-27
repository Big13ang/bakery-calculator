import React, { memo, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { cn, formatPrice } from '../../utils';
import { Icons } from './Icons';
import { Typography } from './Typography';

interface Option {
    label: string;
    value: string;
    price?: number | string;
    unit?: string;
}

interface SelectProps {
    label?: string;
    value: string;
    options: Option[] | string[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const Select = memo(({ label, value, options, onChange, placeholder = 'انتخاب کنید', className }: SelectProps) => {
    const [visible, setVisible] = useState(false);

    const normalizedOptions: Option[] = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    const hasExtraInfo = (opt: Option | undefined) => {
        return opt && (opt.price !== undefined || opt.unit !== undefined);
    };

    return (
        <View className={cn("gap-2", className)}>
            {label && (
                <Typography variant="micro" className="opacity-80 pr-1 text-left">
                    {label}
                </Typography>
            )}
            <TouchableOpacity
                onPress={() => setVisible(true)}
                className={cn(
                    "flex-row items-center justify-between w-full p-4 rounded-2xl bg-bakery-soft border border-bakery-border",
                    hasExtraInfo(selectedOption) ? "py-2.5 min-h-[64px]" : "h-[52px]"
                )}
            >
                <View className="flex-1 text-left justify-center">
                    {hasExtraInfo(selectedOption) ? (
                        <View className="gap-0.5">
                            <Typography variant="body" className="text-bakery-text text-left font-bold">
                                {selectedOption?.label}
                            </Typography>
                            <View className="flex-row justify-between items-center w-full">
                                <Typography variant="caption" className="opacity-60">
                                    واحد: {selectedOption?.unit || '-'}
                                </Typography>
                                <Typography variant="caption" className="font-bold text-bakery-accent">
                                    {typeof selectedOption?.price === 'number' ? formatPrice(selectedOption.price) : selectedOption?.price} تومان
                                </Typography>
                            </View>
                        </View>
                    ) : (
                        <Typography variant="body" className="text-bakery-text text-left font-bold">
                            {selectedOption?.label || (value ? value : placeholder)}
                        </Typography>
                    )}
                </View>
                <Icons.ChevronDown size={20} color="#4A3728" className="opacity-50 ml-2" />
            </TouchableOpacity>

            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View className="flex-1 bg-black/50 justify-end">
                        <TouchableWithoutFeedback>
                            <View className="bg-[#FDF8F1] w-full rounded-t-3xl border-t border-[#D9C4A9] shadow-2xl pb-8 max-h-[70%]">
                                <View className="items-center pt-4 pb-6">
                                    <View className="w-12 h-1.5 bg-[#D9C4A9]/50 rounded-full mb-6" />
                                    <Typography variant="h3" className="text-bakery-text">{label || placeholder}</Typography>
                                </View>

                                <FlatList
                                    data={normalizedOptions}
                                    keyExtractor={(item) => item.value}
                                    className="px-4"
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                onChange(item.value);
                                                setVisible(false);
                                            }}
                                            className={cn(
                                                "p-4 border-b border-[#D9C4A9]/30 flex-row items-center justify-start gap-3 active:bg-[#F9F1E5] rounded-xl mb-1",
                                                value === item.value ? "bg-[#F9F1E5]" : ""
                                            )}
                                        >
                                            <View className={cn(
                                                "w-2 h-2 rounded-full",
                                                value === item.value ? "bg-[#D97706]" : "bg-transparent border border-[#D9C4A9]"
                                            )} />
                                            <View className="flex-1 text-left">
                                                {hasExtraInfo(item) ? (
                                                    <View className="gap-0.5">
                                                        <Typography variant="body" className={cn(
                                                            "text-left",
                                                            value === item.value ? "font-black text-[#D97706]" : "font-medium text-[#4A3728]"
                                                        )}>
                                                            {item.label}
                                                        </Typography>
                                                        <View className="flex-row justify-between items-center w-full">
                                                            <Typography variant="caption" className="opacity-60">
                                                                واحد: {item.unit || '-'}
                                                            </Typography>
                                                            <Typography variant="caption" className="font-bold text-bakery-accent">
                                                                {typeof item.price === 'number' ? formatPrice(item.price) : item.price} تومان
                                                            </Typography>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <Typography variant="body" className={cn(
                                                        "text-left",
                                                        value === item.value ? "font-black text-[#D97706]" : "font-medium text-[#4A3728]"
                                                    )}>
                                                        {item.label}
                                                    </Typography>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
});

Select.displayName = 'Select';

export default Select;

