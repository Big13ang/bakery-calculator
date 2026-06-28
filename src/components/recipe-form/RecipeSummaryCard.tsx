import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
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
        ingredientsCost: number;
        overheadCost: number;
    };
    outputUnitId: string;
    units: { id: string; name: string }[];
    isPending?: boolean;
}

export const RecipeSummaryCard = ({ summary, outputUnitId, units, isPending = false }: RecipeSummaryCardProps) => {
    const unitName = units.find(u => u.id === outputUnitId)?.name || '-';

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isPending ? 0.55 : 1, { duration: 200 }),
        };
    }, [isPending]);

    return (
        <Animated.View style={animatedStyle}>
            <Card className="bg-[#F9F1E5] rounded-2xl gap-4 border-bakery-accent/20">
                <View className="flex-row items-center gap-2 border-b border-dashed border-bakery-border pb-2">
                    <Icons.TrendingUp size={16} color="#D97706" />
                    <Typography variant="h3" className="text-sm">خلاصه محاسبات</Typography>
                    {isPending && (
                        <View className="w-1.5 h-1.5 rounded-full bg-bakery-accent animate-pulse ml-auto" />
                    )}
                </View>
                <View className="gap-2.5">
                    <View className="flex-row justify-between">
                        <Typography variant="micro" className="opacity-70">هزینه مواد اولیه:</Typography>
                        <Typography variant="micro" className="font-black">{formatPrice(summary.ingredientsCost)} تومان</Typography>
                    </View>
                    <View className="flex-row justify-between">
                        <Typography variant="micro" className="opacity-70">هزینه های مازاد بر تولید:</Typography>
                        <Typography variant="micro" className="font-black">{formatPrice(summary.overheadCost)} تومان</Typography>
                    </View>
                    <View className="flex-row justify-between border-t border-dashed border-bakery-border pt-2 my-1">
                        <Typography variant="micro" className="opacity-80 font-bold">هزینه کل تولید:</Typography>
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
        </Animated.View>
    );
};
