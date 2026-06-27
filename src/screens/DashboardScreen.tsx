import { useMemo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PolicyAcceptModal } from '../components/common/PolicyAcceptModal';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils';
import { CardIllustration } from '../components/illustrations/CardIllustration';

interface DashboardScreenProps {
    onNavigate: (tab: string) => void;
    onAddIngredient: () => void;
    onAddRecipe: () => void;
}

export const DashboardScreen = ({ onNavigate, onAddIngredient, onAddRecipe }: DashboardScreenProps) => {
    const { recipes, ingredients, settings, updateSetting } = useApp();

    const { totalCost, totalProfit, profitPercentage } = useMemo(() => {
        const cost = recipes.reduce((acc, r) => acc + (r.totalCost || 0), 0);
        const revenue = recipes.reduce((acc, r) => acc + (r.totalPrice || 0), 0);
        const profit = revenue - cost;
        const percentage = cost > 0 ? (profit / cost) * 100 : 0;
        return {
            totalCost: cost,
            totalProfit: profit,
            profitPercentage: percentage
        };
    }, [recipes]);

    const handleAcceptTerms = useCallback(async () => {
        await updateSetting('hasAcceptedTerms', true);
    }, [updateSetting]);

    return (
        <Screen className="p-4 pt-8 gap-y-5">
            <View className="flex-col items-start gap-1 mb-3">
                <Typography variant="h1" className="text-3xl font-display text-bakery-text text-right">
                    {settings.businessName || 'دید کلی کسب و کار'}
                </Typography>
                <Typography variant="micro" className="text-xs font-black uppercase tracking-widest opacity-50 text-right">
                    Production Hub
                </Typography>
            </View>

            <View className="flex-col gap-3">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 flex-row-reverse items-center justify-between p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-40 active:scale-95"
                        style={{ direction: 'ltr' }}
                        onPress={() => onNavigate('ingredients')}
                    >
                        <View className="w-[48%] flex-col items-end">
                            <Typography variant="body" className="text-sm font-bold mb-2 opacity-80 text-right">مواد اولیه</Typography>
                            <Typography variant="h1" className="text-5xl font-display leading-none text-right">{ingredients.length}</Typography>
                        </View>
                        <View className="w-[48%] max-w-[120px] aspect-square items-center justify-center">
                            <CardIllustration variant="ingredients" className="w-full h-full" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 flex-row-reverse items-center justify-between p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-40 active:scale-95"
                        style={{ direction: 'ltr' }}
                        onPress={() => onNavigate('recipes')}
                    >
                        <View className="w-[48%] flex-col items-end">
                            <Typography variant="body" className="text-sm font-bold mb-2 opacity-80 text-right">دستور پخت</Typography>
                            <Typography variant="h1" className="text-5xl font-display leading-none text-right">{recipes.length}</Typography>
                        </View>
                        <View className="w-[48%] max-w-[120px] aspect-square items-center justify-center">
                            <CardIllustration variant="recipes" className="w-full h-full" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-28 active:scale-95 relative overflow-hidden flex-col justify-center items-end"
                        style={{ direction: 'ltr' }}
                        onPress={onAddIngredient}
                    >
                        <View className="z-10 w-full">
                            <Typography variant="body" className="text-sm font-bold leading-tight text-right w-full">ثبت ماده اولیه</Typography>
                        </View>
                        <View className="absolute bottom-0 left-0 w-20 h-20 -mb-2 -ml-2 opacity-95 pointer-events-none">
                            <CardIllustration variant="add-ingredient" className="w-full h-full" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-1 p-4 bg-white border border-bakery-border rounded-2xl shadow-sm h-28 active:scale-95 relative overflow-hidden flex-col justify-center items-end"
                        style={{ direction: 'ltr' }}
                        onPress={onAddRecipe}
                    >
                        <View className="z-10 w-full">
                            <Typography variant="body" className="text-sm font-bold leading-tight text-right w-full">افزودن دستور پخت</Typography>
                        </View>
                        <View className="absolute bottom-0 left-0 w-20 h-20 -mb-2 -ml-2 opacity-95 pointer-events-none">
                            <CardIllustration variant="add-recipe" className="w-full h-full" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Card className="p-6 mt-4 relative overflow-hidden">
                <View className="flex-row justify-between items-center mb-5 z-10">
                    <View className="flex-row items-center gap-2.5">
                        <Icons.BarChart size={20} color="#D97706" />
                        <Typography variant="body" className="tracking-tight text-sm font-bold">خلاصه عملکرد</Typography>
                    </View>
                    <Badge value={`${profitPercentage.toFixed(1)}٪`} label="بازدهی" className="px-3 py-1.5 rounded-xl" />
                </View>

                <View className="flex-row relative z-10 divide-x divide-x-reverse divide-bakery-border/40">
                    <View className="flex-1 pr-1 items-start">
                        <Typography variant="body" className="text-xs font-bold opacity-65 mb-1 text-right">مجموع هزینه‌ها</Typography>
                        <View className="flex-row items-baseline">
                            <Typography variant="h1" className="text-3xl font-display leading-tight">{formatPrice(totalCost)}</Typography>
                            <Typography variant="body" className="text-xs font-bold opacity-85 mr-1">تومان</Typography>
                        </View>
                    </View>
                    <View className="flex-1 pl-4 items-start">
                        <Typography variant="body" className="text-xs font-bold opacity-65 mb-1 text-right">مجموع سود نهایی</Typography>
                        <View className="flex-row items-baseline">
                            <Typography variant="h1" className="text-3xl font-display leading-tight">{formatPrice(totalProfit)}</Typography>
                            <Typography variant="body" className="text-xs font-bold opacity-85 mr-1">تومان</Typography>
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
