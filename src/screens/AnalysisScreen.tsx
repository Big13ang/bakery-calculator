import { View } from 'react-native';
import { EmptyState } from '../components/common/EmptyState';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { RecipeWithIngredients } from '../types';
import { formatPrice } from '../utils';

// Logic from existing App
const calculatePrediction = (history: any[]) => {
    if (history.length < 2) return null;
    let totalGrowthRate = 0;
    for (let i = 1; i < history.length; i++) {
        const growth = (history[i].newPrice - history[i - 1].newPrice) / history[i - 1].newPrice;
        totalGrowthRate += growth;
    }
    const avgGrowthRate = totalGrowthRate / (history.length - 1);
    const lastPrice = history[history.length - 1].newPrice;
    return lastPrice * (1 + avgGrowthRate);
};

export const AnalysisScreen = () => {
    const { recipes } = useApp();

    const getInflation = (r: RecipeWithIngredients) => {
        if (r.priceHistory.length < 2) return -Infinity;
        const last = r.priceHistory[r.priceHistory.length - 1].newPrice;
        const prev = r.priceHistory[r.priceHistory.length - 2].newPrice;
        return (last - prev) / prev;
    };

    const sortedRecipes = [...recipes].sort((a, b) => getInflation(b) - getInflation(a));

    return (
        <Screen className="p-4 pt-8 pb-32">
            <View className="flex-col gap-0.5 mb-6">
                <Typography variant="h1">تحلیل و پیش‌بینی</Typography>
                <Typography variant="micro" className="opacity-50 tracking-widest text-[9px]">Market Insights</Typography>
            </View>

            {recipes.length === 0 ? (
                <EmptyState
                    title="داده‌ای برای تحلیل موجود نیست"
                    description="دستور پختی ایجاد کنید و قیمت مواد اولیه را به‌روزرسانی کنید تا تحلیل‌های هوشمند و پیش‌بینی قیمت فعال شود."
                    icon="BarChart"
                />
            ) : (
                <View className="gap-y-4">
                    {sortedRecipes.map(recipe => {
                        const inflationRate = getInflation(recipe) * 100;
                        const inflationText = `${inflationRate >= 0 ? '+' : ''}${inflationRate.toFixed(0)}%`;
                        const prediction = calculatePrediction(recipe.priceHistory);

                        return (
                            <Card key={recipe.id} className="p-4 flex-col gap-4">
                                <View className="flex-row justify-between items-center">
                                    <Typography variant="h3" className="text-lg">{recipe.name}</Typography>
                                    {recipe.priceHistory.length >= 2 && (
                                        <Badge
                                            value={inflationText}
                                            label="تورم"
                                        />
                                    )}
                                </View>

                                <View className="flex-row justify-between pt-2 border-t border-dashed border-bakery-border">
                                    <View className="flex-col">
                                        <Typography variant="micro" className="opacity-50 uppercase">قیمت فروش فعلی</Typography>
                                        <Typography variant="h3" className="text-sm">{formatPrice(recipe.currentPrice || 0)} ت</Typography>
                                    </View>
                                    <View className="flex-col items-end">
                                        <Typography variant="micro" className="text-bakery-accent uppercase">پیش‌بینی بعدی</Typography>
                                        <Typography variant="h3" className="text-bakery-accent text-sm">{prediction ? `${formatPrice(prediction)} ت` : 'نامشخص'}</Typography>
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>
            )}
        </Screen>
    );
};
