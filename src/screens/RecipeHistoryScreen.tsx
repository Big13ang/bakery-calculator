import { View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { formatDate, formatPrice } from '../utils';

// Note: Recharts is Web only. For RN we need react-native-chart-kit or similar.
// Since user didn't specify a chart lib and I can't install big ones easily without verifying compatibility,
// I will implement a "Visual Bar" representation for now to keep it "Clean" and dependency-light, or just the list.
// The web version had a LineChart. I'll focus on the data list for "Exact Design" information content
// and maybe a simple SVG sparkline if I have time. 
// For now, list is safer.

interface RecipeHistoryScreenProps {
    recipeId: string;
    onBack: () => void;
}

export const RecipeHistoryScreen = ({ recipeId, onBack }: RecipeHistoryScreenProps) => {
    const { recipes } = useApp();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) return null;

    return (
        <Screen>
            <Header title={`تاریخچه ${recipe.name}`} onBack={onBack} />

            <View className="px-4 pb-8 gap-5">
                <Card className="p-5 overflow-hidden rounded-2xl gap-4">
                    <Typography variant="micro" className="opacity-60 uppercase text-[10px]">نمودار نوسانات قیمت فروش (هر {recipe.outputUnit})</Typography>

                    <View className="h-32 flex-row items-end justify-between px-2">
                        {recipe.priceHistory.map((record, i) => {
                            const maxPrice = Math.max(...recipe.priceHistory.map(r => r.sellingPrice), 1);
                            const height = (record.sellingPrice / maxPrice) * 100;
                            return (
                                <View key={i} className="items-center flex-1">
                                    <View
                                        className="w-full bg-bakery-accent/20 rounded-t-sm"
                                        style={{ height: `${height}%`, maxWidth: 12 }}
                                    >
                                        <View className="absolute top-0 left-0 right-0 h-1 bg-bakery-accent rounded-full" />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View className="h-px bg-bakery-border opacity-20" />
                </Card>

                <View className="gap-5">
                    <Typography variant="micro" className="opacity-60 uppercase px-1">گزارش تغییرات (رکوردها)</Typography>

                    {[...recipe.priceHistory].reverse().map((record, idx, arr) => {
                        const chronologicalIndex = arr.length - 1 - idx;
                        const prevRecord = recipe.priceHistory[chronologicalIndex - 1];
                        const inflationRate = prevRecord ? ((record.sellingPrice - prevRecord.sellingPrice) / prevRecord.sellingPrice) * 100 : 0;

                        return (
                            <Card key={idx} className="p-5 flex-col gap-3 rounded-2xl">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2">
                                        <View className="bg-bakery-soft px-2 py-1 rounded-lg border border-bakery-border">
                                            <Typography variant="micro" className="text-[10px]">{record.reason}</Typography>
                                        </View>
                                        {prevRecord && (
                                            <Badge
                                                value={`${inflationRate >= 0 ? '+' : ''}${inflationRate.toFixed(1)}٪`}
                                                label="تغییر"
                                            />
                                        )}
                                    </View>
                                    <Typography variant="micro" className="opacity-50 text-[10px]">{formatDate(record.timestamp)}</Typography>
                                </View>

                                <View className="flex-row justify-between items-center pt-3 border-t border-bakery-border border-dashed">
                                    <View className="flex-col gap-1">
                                        <Typography variant="micro" className="opacity-50 uppercase">قیمت فروش</Typography>
                                        <Typography variant="h3" className="text-sm">{formatPrice(record.sellingPrice)} تومان</Typography>
                                    </View>
                                    <View className="flex-col items-end gap-1">
                                        <Typography variant="micro" className="opacity-50 uppercase">بهای تمام شده</Typography>
                                        <Typography variant="h3" className="text-sm opacity-60">{formatPrice(record.costPerUnit)} تومان</Typography>
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>
            </View>
        </Screen>
    );
};
