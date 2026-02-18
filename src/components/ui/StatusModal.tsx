import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Button } from './Button';
import { Icons } from './Icons';
import { Typography } from './Typography';

interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}

export const StatusModal = ({
    visible,
    onClose,
    title,
    message,
    type = 'success'
}: StatusModalProps) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return { name: 'Package', color: '#059669', bg: 'bg-emerald-50' }; // Package as a placeholder for checkmark if none
            case 'error':
                return { name: 'X', color: '#DC2626', bg: 'bg-red-50' };
            case 'warning':
                return { name: 'TrendingUp', color: '#D97706', bg: 'bg-amber-50' };
            default:
                return { name: 'Package', color: '#4A3728', bg: 'bg-bakery-soft' };
        }
    };

    const iconData = getIcon();
    // @ts-ignore
    const IconComponent = Icons[iconData.name] || Icons.Package;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
                <Pressable className="bg-bakery-card w-full rounded-t-[32px] p-8 pb-10 border-t border-bakery-border shadow-2xl items-center">
                    <View className="w-12 h-1.5 bg-stone-300 rounded-full self-center mb-8" />

                    <View className="w-20 h-20 rounded-full items-center justify-center mb-6 border border-bakery-border bg-bakery-soft">
                        <IconComponent size={40} color="#4A3728" />
                    </View>

                    <Typography variant="h2" className="text-center mb-2">{title}</Typography>
                    <Typography variant="body" className="text-center opacity-60 leading-relaxed mb-8">
                        {message}
                    </Typography>

                    <Button
                        variant="primary"
                        label="تایید"
                        onPress={onClose}
                        style={{ width: '100%' }}
                        className="w-full h-14"
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};
