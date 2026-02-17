import { TouchableOpacity, View } from 'react-native';
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
    const { settings, setSettings } = useApp();

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

                <Card className="gap-y-5">
                    <Typography variant="micro" className="opacity-60 uppercase text-[11px]">اطلاعات کسب و کار</Typography>
                    <View className="gap-y-4 pt-1 border-t border-dashed border-[#D9C4A9]/40">
                        <Input
                            label="نام کسب و کار"
                            placeholder="مثال: نانوایی برکت"
                            value={settings.businessName}
                            onChangeText={text => setSettings({ ...settings, businessName: text })}
                        />
                        <Input
                            label="نام مالک کسب و کار"
                            placeholder="مثال: محمد محمدی"
                            value={settings.ownerName}
                            onChangeText={text => setSettings({ ...settings, ownerName: text })}
                        />
                    </View>
                </Card>

                <Card className="gap-y-5">
                    <Typography variant="micro" className="opacity-60 uppercase text-[11px]">مدیریت اطلاعات</Typography>
                    <View className="flex-row gap-3 pt-1 border-t border-dashed border-[#D9C4A9]/40">
                        <TouchableOpacity className="flex-1 flex-col items-center gap-2 p-5 bg-bakery-soft rounded-2xl border border-bakery-border">
                            <Icons.Download size={20} color="#4A3728" />
                            <Typography variant="micro" className="text-[11px]">خروجی اطلاعات</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 flex-col items-center gap-2 p-5 bg-bakery-soft rounded-2xl border border-bakery-border">
                            <Icons.Upload size={20} color="#4A3728" />
                            <Typography variant="micro" className="text-[11px]">وارد کردن اطلاعات</Typography>
                        </TouchableOpacity>
                    </View>
                    <Button variant="danger" icon={<Icons.Trash size={16} color="#7C2D12" />} label="پاکسازی کامل اطلاعات" className="w-full bg-bakery-soft border-bakery-border" />
                </Card>

                <View className="items-center py-6 gap-y-6 mb-20">
                    <View className="gap-y-1.5 items-center">
                        <Typography variant="micro" className="opacity-40 tracking-widest text-[10px]">Version 1.0.0</Typography>
                        <Typography variant="caption" className="font-bold text-[14px]">محاسبه‌گر قیمت شیرینی © ۲۰۲۶</Typography>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
