import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface DeleteConfirmationProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export const DeleteConfirmation = ({
    visible,
    onCancel,
    onConfirm,
    title = 'آیا از حذف مطمئن هستید؟',
    description = 'این عمل غیرقابل بازگشت است و تمام داده‌های مرتبط پاک خواهند شد.'
}: DeleteConfirmationProps) => {
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
                        <View className="w-16 h-16 bg-bakery-soft rounded-full items-center justify-center mb-2 border border-bakery-border">
                            <Icons.Trash size={32} color="#7C2D12" />
                        </View>

                        <Typography variant="h2" className="text-center">{title}</Typography>
                        <Typography variant="caption" className="text-center opacity-60 leading-relaxed max-w-[280px]">
                            {description}
                        </Typography>
                    </View>

                    <View className="flex-row gap-3">
                        <Button
                            variant="secondary"
                            label="انصراف"
                            onPress={onCancel}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            label="بله، حذف شود"
                            onPress={onConfirm}
                            className="flex-1 bg-bakery-danger"
                        />
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
