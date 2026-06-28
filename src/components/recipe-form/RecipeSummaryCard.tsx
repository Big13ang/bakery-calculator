import { View } from 'react-native';
import { formatPrice } from '../../utils';
import { Card } from '../ui/Card';
import { Icons } from '../ui/Icons';
import { Typography } from '../ui/Typography';

interface RecipeSummaryCardProps {
    summary: {
        totalCost: number;
        costPerUnit: number;
        sellingPrice: number;
        totalPrice: number;
        profit: number;
    };
    outputUnitId: string;
    units: { id: string; name: string }[];
}

export const RecipeSummaryCard = ({ summary, outputUnitId, units }: RecipeSummaryCardProps) => {
    const unitName = units.find(u => u.id === outputUnitId)?.name || '-';
    return (
        <Card className="bg-[#F9F1E5] rounded-2xl gap-4 border-bakery-accent/20">
            <View className="flex-row items-center gap-2 border-b border-dashed border-bakery-border pb-2">
                <Icons.TrendingUp size={16} color="#D97706" />
                <Typography variant="h3" className="text-sm">خلاصه محاسبات</Typography>
            </View>
            <View className="gap-2.5">
                <View className="flex-row justify-between">
                    <Typography variant="micro" className="opacity-70">هزینه کل مواد اولیه:</Typography>
                    <Typography variant="micro" className="font-black">{formatPrice(summary.totalCost)} تومان</Typography>
                </View>
                <View className="flex-row justify-between">
                    <Typography variant="micro" className="opacity-70">قیمت تمام شده هر {unitName}:</Typography>
                    <Typography variant="micro" className="font-black">{formatPrice(summary.costPerUnit)} تومان</Typography>
                </View>
                <View className="flex-row justify-between">
                    <Typography variant="micro" className="text-bakery-accent/80">قیمت فروش هر {unitName}:</Typography>
                    <Typography variant="micro" className="text-bakery-accent/80 font-black">{formatPrice(summary.sellingPrice)} تومان</Typography>
                </View>
                <View className="h-px bg-bakery-border opacity-30 my-1" />
                <View className="flex-row justify-between">
                    <Typography variant="body" className="uppercase font-black">قیمت فروش کل:</Typography>
                    <Typography variant="body" className="font-black">{formatPrice(summary.totalPrice)} تومان</Typography>
                </View>
                <View className="flex-row justify-between bg-bakery-accent/5 p-2 rounded-lg border border-bakery-accent/10">
                    <Typography variant="body" className="text-bakery-accent font-black">سود خالص کل:</Typography>
                    <Typography variant="body" className="text-bakery-accent font-black">{formatPrice(summary.profit)} تومان</Typography>
                </View>
            </View>
        </Card>
    );
};
