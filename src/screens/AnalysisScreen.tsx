import { View } from 'react-native';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import { formatPrice } from '../utils';

interface AnalysisScreenProps {
    onNavigate?: (tab: string) => void;
}

// Logic from existing App
const calculatePrediction = (history: any[]) => {
    if (history.length < 2) return null;
    let totalGrowthRate = 0;
    for (let i = 1; i < history.length; i++) {
        const growth = (history[i].sellingPrice - history[i - 1].sellingPrice) / history[i - 1].sellingPrice;
        totalGrowthRate += growth;
    }
    const avgGrowthRate = totalGrowthRate / (history.length - 1);
    const lastPrice = history[history.length - 1].sellingPrice;
    return lastPrice * (1 + avgGrowthRate);
};

export const AnalysisScreen = () => {
    const { recipes } = useApp();

    const getInflation = (r: Recipe) => {
        if (r.priceHistory.length < 2) return -Infinity;
        const last = r.priceHistory[r.priceHistory.length - 1].sellingPrice;
        const prev = r.priceHistory[r.priceHistory.length - 2].sellingPrice;
        return (last - prev) / prev;
    };

    const sortedRecipes = [...recipes].sort((a, b) => getInflation(b) - getInflation(a));

    return (
        <Screen className="p-4 pt-8 pb-32">
            <View className="flex-col gap-0.5 mb-6">
                <Typography variant="h1">تحلیل و پیش‌بینی</Typography>
                <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">Market Insights</Typography>
            </View>

            <View className="gap-y-5 px-0">

                {recipes.length === 0 ? (
                    <View className="py-16 items-center gap-y-6">
                        <View className="w-20 h-20 bg-bakery-soft rounded-full items-center justify-center border border-bakery-border">
                            <Icons.BarChart size={40} color="#4A372830" />
                        </View>
                        <View className="gap-y-2 items-center">
                            <Typography variant="h1">هنوز داده‌ای ثبت نشده است</Typography>
                            <Typography variant="caption" className="opacity-60 text-center max-w-[240px] leading-relaxed">دستور پختی ایجاد کنید تا تحلیل‌های هوشمند فعال شود.</Typography>
                        </View>
                    </View>
                ) : (
                    <View className="gap-y-4">
                        {sortedRecipes.map(recipe => {
                            const inflationRate = getInflation(recipe) * 100;
                            const prediction = calculatePrediction(recipe.priceHistory);

                            return (
                                <Card key={recipe.id} className="p-4 flex-col gap-4">
                                    <View className="flex-row justify-between items-center">
                                        <Typography variant="h3" className="text-lg">{recipe.name}</Typography>
                                        {recipe.priceHistory.length >= 2 && (
                                            <Badge
                                                value={`${inflationRate >= 0 ? '+' : ''}${inflationRate.toFixed(0)}٪`}
                                                label="تورم"
                                            />
                                        )}
                                    </View>

                                    <View className="flex-row justify-between pt-2 border-t border-dashed border-bakery-border">
                                        <View className="flex-col">
                                            <Typography variant="micro" className="opacity-50 uppercase">قیمت فروش فعلی</Typography>
                                            <Typography variant="h3" className="text-sm">{formatPrice(recipe.currentPrice / recipe.outputCount)} ت</Typography>
                                        </View>
                                        <View className="flex-col items-end">
                                            <Typography variant="micro" className="text-bakery-accent uppercase">پیش‌بینی بعدی</Typography>
                                            <Typography variant="h3" className="text-bakery-accent text-sm">{prediction ? `${formatPrice(prediction / recipe.outputCount)} ت` : 'نامشخص'}</Typography>
                                        </View>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
                )}
            </View>
        </Screen>
    );
};
