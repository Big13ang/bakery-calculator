import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';

interface SettingsScreenProps {
    onNavigate: (tab: string) => void;
}

const statusMap = {
    free: 'نسخه رایگان',
    test: 'نسخه تست',
    plus: 'نسخه پلاس',
    pro: 'نسخه پرو'
};

export const SettingsScreen = ({ onNavigate }: SettingsScreenProps) => {
    const { settings, updateSetting, exportData, importData, resetAllData } = useApp();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const router = useRouter();

    const [localBusinessName, setLocalBusinessName] = useState(settings.businessName);
    const [localOwnerName, setLocalOwnerName] = useState(settings.ownerName);
    const [prevSettings, setPrevSettings] = useState(settings);

    if (settings !== prevSettings) {
        setPrevSettings(settings);
        setLocalBusinessName(settings.businessName);
        setLocalOwnerName(settings.ownerName);
    }

    const handleCleanup = () => {
        setShowResetConfirm(true);
    };

    return (
        <Screen className="p-4 pt-8 pb-32">
            <View className="flex-col gap-0.5 mb-6">
                <Typography variant="h1">تنظیمات برنامه</Typography>
                <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">App Configuration</Typography>
            </View>

            <View className="gap-y-5">

                <Card className="gap-y-5">
                    <View className="flex-row justify-between items-center">
                        <Typography variant="micro" className="opacity-60 uppercase text-[11px]">وضعیت اشتراک</Typography>
                        <View className="px-4 py-1 rounded-full bg-bakery-accent shadow-sm">
                            <Typography variant="micro" className="text-white text-[10px] font-black">{statusMap[settings.subscriptionStatus]}</Typography>
                        </View>
                    </View>

                    {settings.subscriptionStatus === 'free' && (
                        <View className="p-4 bg-bakery-soft rounded-2xl border border-dashed border-bakery-border gap-y-4">
                            <Typography variant="caption" className="font-bold opacity-80 leading-relaxed">
                                شما در حال استفاده از نسخه رایگان هستید. برای دسترسی به تحلیل‌های پیشرفته و فضای ابری ارتقا دهید.
                            </Typography>
                            <Button variant="primary" label="خرید اشتراک پرو" size="sm" className="w-full" />
                        </View>
                    )}
                </Card>

                <Card className="gap-y-4">
                    <Typography variant="micro" className="opacity-60 uppercase text-[11px] mb-1">اطلاعات کسب و کار</Typography>
                    <View className="gap-y-4 pt-4 border-t border-dashed border-[#D9C4A9]/40">
                        <Input
                            label="نام کسب و کار"
                            placeholder="مثال: نانوایی برکت"
                            value={localBusinessName}
                            onChangeText={setLocalBusinessName}
                            onBlur={() => {
                                if (localBusinessName !== settings.businessName) {
                                    updateSetting('businessName', localBusinessName);
                                }
                            }}
                        />
                        <Input
                            label="نام مالک کسب و کار"
                            placeholder="مثال: محمد محمدی"
                            value={localOwnerName}
                            onChangeText={setLocalOwnerName}
                            onBlur={() => {
                                if (localOwnerName !== settings.ownerName) {
                                    updateSetting('ownerName', localOwnerName);
                                }
                            }}
                        />
                    </View>
                </Card>

                <Card className="gap-y-4">
                    <Typography variant="micro" className="opacity-60 uppercase text-[11px] mb-1">مدیریت اطلاعات</Typography>
                    <View className="flex-row gap-3 pt-4 border-t border-dashed border-[#D9C4A9]/40">
                        <TouchableOpacity
                            onPress={exportData}
                            className="flex-1 flex-col items-center gap-2 p-5 bg-bakery-soft rounded-2xl border border-bakery-border"
                        >
                            <Icons.Download size={20} color="#4A3728" />
                            <Typography variant="micro" className="text-[11px]">خروجی اطلاعات</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={importData}
                            className="flex-1 flex-col items-center gap-2 p-5 bg-bakery-soft rounded-2xl border border-bakery-border"
                        >
                            <Icons.Upload size={20} color="#4A3728" />
                            <Typography variant="micro" className="text-[11px]">وارد کردن اطلاعات</Typography>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-2">
                        <Button
                            onPress={handleCleanup}
                            variant="danger"
                            icon={<Icons.Trash size={16} color="#7C2D12" />}
                            label="پاکسازی کامل اطلاعات"
                            className="w-full bg-bakery-soft border-bakery-border"
                        />
                    </View>
                </Card>

                <Card className="gap-y-4">
                    <Typography variant="micro" className="opacity-60 uppercase text-[11px] mb-1">حمایت و قوانین</Typography>
                    <View className="gap-y-2 pt-4 border-t border-dashed border-[#D9C4A9]/40">
                        <TouchableOpacity
                            onPress={() => router.push('/privacy-policy')}
                            className="flex-row items-center justify-between p-4 bg-bakery-soft rounded-2xl border border-bakery-border"
                        >
                            <View className="flex-row items-center gap-3">
                                <Icons.ExternalLink size={18} color="#4A3728" />
                                <Typography variant="body" className="text-[14px]">سیاست حریم خصوصی</Typography>
                            </View>
                            <Icons.ChevronLeft size={18} color="#4A3728" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/terms-of-service')}
                            className="flex-row items-center justify-between p-4 bg-bakery-soft rounded-2xl border border-bakery-border"
                        >
                            <View className="flex-row items-center gap-3">
                                <Icons.ExternalLink size={18} color="#4A3728" />
                                <Typography variant="body" className="text-[14px]">شرایط و ضوابط استفاده</Typography>
                            </View>
                            <Icons.ChevronLeft size={18} color="#4A3728" />
                        </TouchableOpacity>
                    </View>
                </Card>

                <View className="items-center py-6 gap-y-6 mb-20">
                    <View className="gap-y-1.5 items-center">
                        <Typography variant="micro" className="opacity-40 tracking-widest text-[10px]">Version 1.0.0</Typography>
                        <Typography variant="caption" className="font-bold text-[14px]">تمامی حقوق برای <Typography variant="caption" className="font-black text-bakery-accent">appsaz.ir</Typography> محفوظ است</Typography>
                    </View>
                </View>
            </View>

            <ConfirmModal
                visible={showResetConfirm}
                onCancel={() => setShowResetConfirm(false)}
                onConfirm={async () => {
                    setShowResetConfirm(false);
                    await resetAllData();
                }}
                title="پاکسازی کامل اطلاعات"
                description="آیا مطمئن هستید که می‌خواهید تمام اطلاعات برنامه (مواد اولیه، دستورپخت‌ها و تنظیمات) را حذف کنید؟ این عمل قابل بازگشت نیست."
                confirmLabel="حذف همه"
                variant="danger"
            />
        </Screen>
    );
};
