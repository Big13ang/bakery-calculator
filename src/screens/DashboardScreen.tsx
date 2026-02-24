import { TouchableOpacity, View } from 'react-native';
import { PolicyAcceptModal } from '../components/common/PolicyAcceptModal';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils';

interface DashboardScreenProps {
    onNavigate: (tab: string) => void;
    onAddIngredient: () => void;
    onAddRecipe: () => void;
}

export const DashboardScreen = ({ onNavigate, onAddIngredient, onAddRecipe }: DashboardScreenProps) => {
    const { recipes, ingredients, settings, updateSetting } = useApp();

    const totalCost = recipes.reduce((acc, r) => acc + (r.totalCost || 0), 0);
    const totalRevenue = recipes.reduce((acc, r) => acc + (r.totalPrice || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    const handleAcceptTerms = async () => {
        await updateSetting('hasAcceptedTerms', true);
    };

    return (
        <Screen className="p-4 pt-8 gap-y-5">
            <View className="flex-col items-start gap-0.5 mb-2">
                <Typography variant="h1" className="text-2xl font-display text-bakery-text text-right">
                    {settings.businessName || 'دید کلی کسب و کار'}
                </Typography>
                <Typography variant="micro" className="text-[9px] font-black uppercase tracking-widest opacity-50 text-right">
                    Production Hub
                </Typography>
            </View>

            <View className="flex-col gap-3">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 items-start p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-32 active:scale-95 transition-all"
                        onPress={() => onNavigate('ingredients')}
                    >
                        <View className="w-9 h-9 rounded-xl items-center justify-center mb-3 bg-bakery-soft border border-bakery-border">
                            <Icons.Package size={16} color="#4A3728" />
                        </View>
                        <Typography variant="micro" className="text-[9px] font-black uppercase mb-0.5 opacity-100 text-right">مواد اولیه</Typography>
                        <Typography variant="h1" className="text-2xl font-display leading-tight text-right">{ingredients.length}</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 items-start p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-32 active:scale-95 transition-all"
                        onPress={() => onNavigate('recipes')}
                    >
                        <View className="w-9 h-9 rounded-xl items-center justify-center mb-3 bg-bakery-soft border border-bakery-border">
                            <Icons.ChefHat size={16} color="#4A3728" />
                        </View>
                        <Typography variant="micro" className="text-[9px] font-black uppercase mb-0.5 opacity-100 text-right">دستور پخت</Typography>
                        <Typography variant="h1" className="text-2xl font-display leading-tight text-right">{recipes.length}</Typography>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 py-4 flex-col gap-2 items-center bg-white border border-bakery-border rounded-2xl shadow-sm active:scale-95 transition-all"
                        onPress={onAddIngredient}
                    >
                        <View className="bg-bakery-accent p-2 rounded-full shadow-md">
                            <Icons.Plus size={16} color="white" />
                        </View>
                        <Typography variant="micro" className="text-[10px] font-black text-center">ثبت ماده اولیه</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 py-4 flex-col gap-2 items-center bg-white border border-bakery-border rounded-2xl shadow-sm active:scale-95 transition-all"
                        onPress={onAddRecipe}
                    >
                        <View className="bg-bakery-accent p-2 rounded-full shadow-md">
                            <Icons.ChefHat size={16} color="white" />
                        </View>
                        <Typography variant="micro" className="text-[10px] font-black text-center">افزودن دستور پخت</Typography>
                    </TouchableOpacity>
                </View>
            </View>

            <Card className="p-6 mt-4 relative overflow-hidden">
                <View className="flex-row justify-between items-center mb-5 z-10">
                    <View className="flex-row items-center gap-2">
                        <Icons.BarChart size={16} color="#D97706" />
                        <Typography variant="micro" className="tracking-tight text-[11px]">خلاصه عملکرد</Typography>
                    </View>
                    <Badge value={`${profitPercentage.toFixed(1)}٪`} label="بازدهی" />
                </View>

                <View className="flex-row relative z-10 divide-x divide-x-reverse divide-bakery-border/40">
                    <View className="flex-1 pr-1 items-start">
                        <Typography variant="micro" className="text-[9px] font-black opacity-50 uppercase mb-0.5 text-right">مجموع هزینه‌ها</Typography>
                        <View className="flex-row items-baseline">
                            <Typography variant="h1" className="text-2xl font-display leading-tight">{formatPrice(totalCost)}</Typography>
                            <Typography variant="micro" className="text-[10px] font-bold opacity-80 mr-1">تومان</Typography>
                        </View>
                    </View>
                    <View className="flex-1 pl-4 items-start">
                        <Typography variant="micro" className="text-[9px] font-black opacity-50 uppercase mb-0.5 text-right">مجموع سود نهایی</Typography>
                        <View className="flex-row items-baseline">
                            <Typography variant="h1" className="text-2xl font-display leading-tight">{formatPrice(totalProfit)}</Typography>
                            <Typography variant="micro" className="text-[10px] font-bold opacity-80 mr-1">تومان</Typography>
                        </View>
                    </View>
                </View>

                {/* Decorative Circle */}
                <View className="absolute top-0 right-0 w-24 h-24 bg-[#FDF8F1] rounded-full -mr-12 -mt-12 opacity-50 pointer-events-none" />
            </Card>

            <PolicyAcceptModal
                visible={!settings.hasAcceptedTerms}
                onAccept={handleAcceptTerms}
            />
        </Screen>
    );
};
