import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { cn } from '../../utils';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface ConfirmModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    icon?: keyof typeof Icons;
}

export const ConfirmModal = ({
    visible,
    onCancel,
    onConfirm,
    title,
    description,
    confirmLabel = 'تایید',
    cancelLabel = 'انصراف',
    variant = 'danger',
    icon = 'Trash'
}: ConfirmModalProps) => {
    const IconComponent = Icons[icon];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <Pressable className="flex-1 bg-black/50 justify-end" onPress={onCancel}>
                <Pressable className="bg-bakery-card w-full rounded-t-[32px] p-8 pb-10 border-t border-bakery-border shadow-2xl">
                    <View className="w-12 h-1.5 bg-stone-300 rounded-full self-center mb-8" />

                    <View className="items-center gap-y-4 mb-10">
                        <View className={cn(
                            "w-16 h-16 rounded-full items-center justify-center mb-2 border border-bakery-border bg-bakery-soft"
                        )}>
                            <IconComponent size={32} color="#4A3728" />
                        </View>

                        <Typography variant="h2" className="text-center">{title}</Typography>
                        <Typography variant="caption" className="text-center opacity-60 leading-relaxed max-w-[280px]">
                            {description}
                        </Typography>
                    </View>

                    <View className="flex-row gap-3">
                        <Button
                            variant="primary"
                            label={confirmLabel}
                            onPress={onConfirm}
                            style={{ flex: 1 }}
                            className="h-14"
                        />
                        <Button
                            variant="secondary"
                            label={cancelLabel}
                            onPress={onCancel}
                            style={{ flex: 1 }}
                            className="h-14"
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
