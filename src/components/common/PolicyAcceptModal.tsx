import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface PolicyAcceptModalProps {
    visible: boolean;
    onAccept: () => void;
}

export const PolicyAcceptModal = ({ visible, onAccept }: PolicyAcceptModalProps) => {
    const router = useRouter();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onAccept}
        >
            <View className="flex-1 bg-black/60 items-center justify-center p-6">
                <Card className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl p-0">
                    <View className="p-6 pt-8 items-center bg-bakery-soft/30 border-b border-dashed border-bakery-border/50">
                        <View className="w-16 h-16 bg-bakery-accent/10 rounded-full items-center justify-center mb-4">
                            <Icons.Package size={32} color="#D97706" />
                        </View>
                        <Typography variant="h2" className="text-center">خوش آمدید</Typography>
                        <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">Welcome to Production Calculator</Typography>
                    </View>

                    <ScrollView className="p-6 max-h-[300px]">
                        <Typography variant="body" className="leading-7 text-justify mb-4">
                            برای استفاده از برنامه «عمو قناد»، لطفاً موارد زیر را مطالعه فرمایید:
                        </Typography>

                        <View className="gap-y-4 mb-6">
                            <TouchableOpacity
                                onPress={() => router.push('/privacy-policy')}
                                className="flex-row items-center justify-between p-4 bg-bakery-soft/50 rounded-2xl border border-bakery-border/30"
                            >
                                <View className="flex-row items-center gap-3">
                                    <Icons.ExternalLink size={18} color="#4A3728" />
                                    <Typography variant="body" className="text-[14px]">سیاست حریم خصوصی</Typography>
                                </View>
                                <Icons.ChevronLeft size={16} color="#4A3728" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push('/terms-of-service')}
                                className="flex-row items-center justify-between p-4 bg-bakery-soft/50 rounded-2xl border border-bakery-border/30"
                            >
                                <View className="flex-row items-center gap-3">
                                    <Icons.ExternalLink size={18} color="#4A3728" />
                                    <Typography variant="body" className="text-[14px]">شرایط و ضوابط استفاده</Typography>
                                </View>
                                <Icons.ChevronLeft size={16} color="#4A3728" />
                            </TouchableOpacity>
                        </View>

                        <Typography variant="caption" className="opacity-60 leading-6 text-center italic mb-4">
                            با کلیک بر روی دکمه زیر یا بستن این پنجره، شما تمامی قوانین و سیاست‌های برنامه را می‌پذیرید.
                        </Typography>
                    </ScrollView>

                    <View className="p-6 bg-bakery-soft/20 border-t border-dashed border-bakery-border/50">
                        <Button
                            label="متوجه شدم"
                            variant="primary"
                            className="w-full h-14 rounded-2xl"
                            onPress={onAccept}
                        />
                        <View className="mt-4 flex-row justify-center items-center gap-2 opacity-40">
                            <Typography variant="micro" className="text-[10px]">همیشه از بخش تنظیمات قابل دسترسی است</Typography>
                        </View>
                    </View>
                </Card>
            </View>
        </Modal>
    );
};
