import { View } from 'react-native';
import { EmptyState } from '../components/common/EmptyState';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PriceChart } from '../components/ui/PriceChart';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { cn, formatDate, formatPrice } from '../utils';

interface RecipeHistoryScreenProps {
    recipeId: string;
    onBack: () => void;
}

export const RecipeHistoryScreen = ({ recipeId, onBack }: RecipeHistoryScreenProps) => {
    const { recipes, units } = useApp();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) return null;

    const chartData = recipe.priceHistory.map(record => {
        const d = new Date(record.createdAt);
        // User requested exact format 29/11/1404
        const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).formatToParts(d);

        const day = parts.find(p => p.type === 'day')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const year = parts.find(p => p.type === 'year')?.value;

        return {
            date: d,
            formattedDate: `${day}/${month}/${year}`,
            price: record.newPrice
        };
    });

    return (
        <Screen>
            <Header title={`تاریخچه ${recipe.name}`} onBack={onBack} />

            <View className="px-4 pb-8 gap-5">
                {recipe.priceHistory.length === 0 ? (
                    <EmptyState
                        title="تاریخچه‌ای یافت نشد"
                        description="تغییرات قیمت این دستور پخت در اینجا نمایش داده خواهد شد."
                        icon="TrendingUp"
                    />
                ) : (
                    <>
                        <Card className="p-5 overflow-hidden rounded-2xl gap-4">
                            <Typography variant="micro" className="opacity-60 uppercase text-[10px]">نمودار نوسانات قیمت فروش (هر {units.find(u => u.id === recipe.outputUnitId)?.name || '-'})</Typography>

                            <View className="py-4 items-center">
                                <PriceChart data={chartData} height={160} />
                            </View>
                            <View className="h-px bg-bakery-border opacity-20" />
                        </Card>

                        <View className="gap-5">
                            <Typography variant="micro" className="opacity-60 uppercase px-1">گزارش تغییرات (رکوردها)</Typography>

                            {[...recipe.priceHistory].reverse().map((record, idx, arr) => {
                                const chronologicalIndex = arr.length - 1 - idx;
                                const prevRecord = recipe.priceHistory[chronologicalIndex - 1];
                                const inflationRate = prevRecord ? ((record.newPrice - prevRecord.newPrice) / prevRecord.newPrice) * 100 : 0;

                                const isCostRecalc = record.reason === 'Cost Recalculation';

                                return (
                                    <Card key={idx} className="p-5 flex-col gap-3 rounded-2xl">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center gap-2">
                                                <View className={cn(
                                                    "px-2 py-1 rounded-lg border",
                                                    isCostRecalc ? "bg-[#FFF7ED] border-[#FED7AA]" : "bg-bakery-soft border-bakery-border"
                                                )}>
                                                    <Typography variant="micro" className={cn(
                                                        "text-[10px]",
                                                        isCostRecalc ? "text-[#9A3412] font-black" : "text-bakery-text"
                                                    )}>
                                                        {isCostRecalc ? "محاسبه مجدد هزینه" : record.reason}
                                                    </Typography>
                                                </View>
                                                {prevRecord && (
                                                    <Badge
                                                        value={`${inflationRate >= 0 ? '+' : ''}${inflationRate.toFixed(1)}٪`}
                                                        label="تغییر"
                                                    />
                                                )}
                                            </View>
                                            <Typography variant="micro" className="opacity-50 text-[10px]">{formatDate(record.createdAt)}</Typography>
                                        </View>

                                        <View className="flex-row justify-between items-center pt-3 border-t border-bakery-border border-dashed">
                                            <View className="flex-col gap-1">
                                                <Typography variant="micro" className="opacity-50 uppercase">قیمت فروش</Typography>
                                                <Typography variant="h3" className="text-sm">{formatPrice(record.newPrice)} تومان</Typography>
                                            </View>
                                            <View className="flex-col items-end gap-1">
                                                <Typography variant="micro" className="opacity-50 uppercase">بهای تمام شده</Typography>
                                                <Typography variant="h3" className="text-sm opacity-60">{formatPrice(record.cost || 0)} تومان</Typography>
                                            </View>
                                        </View>
                                    </Card>
                                );
                            })}
                        </View>
                    </>
                )}
            </View>
        </Screen>
    );
};
