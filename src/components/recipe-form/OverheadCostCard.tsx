import React, { memo } from 'react';
import { View } from 'react-native';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatNumberWithCommas, toEnglishDigits } from '../../utils';

interface OverheadCostCardProps {
    overheadCost: string;
    profitMargin: string;
    totalCost: number;
    onUpdateField: (key: 'overheadCost' | 'profitMargin', value: string) => void;
}

export const OverheadCostCard = memo(({
    overheadCost,
    profitMargin,
    totalCost,
    onUpdateField,
}: OverheadCostCardProps) => {
    const displayOverheadValue = formatNumberWithCommas(overheadCost);

    const handleOverheadChange = (val: string) => {
        const cleanVal = toEnglishDigits(val).replace(/[^0-9]/g, '');
        onUpdateField('overheadCost', cleanVal);
    };

    // Derived Toman profit based on current percentage and total cost
    const profitPercentNum = parseFloat(profitMargin) || 0;
    const profitTomanVal = totalCost * profitPercentNum / 100;
    
    // Format Toman profit for input display
    const displayTomanValue = formatNumberWithCommas(Math.round(profitTomanVal).toString());

    // Format percentage for input display
    const displayPercentValue = profitMargin;

    const handlePercentChange = (val: string) => {
        // Allow numeric digits and at most one decimal point
        let cleanVal = toEnglishDigits(val).replace(/[^0-9.]/g, '');
        const parts = cleanVal.split('.');
        if (parts.length > 2) {
            cleanVal = parts[0] + '.' + parts.slice(1).join('');
        }
        onUpdateField('profitMargin', cleanVal);
    };

    const handleTomanChange = (val: string) => {
        const cleanVal = toEnglishDigits(val).replace(/[^0-9]/g, '');
        const numericToman = parseFloat(cleanVal) || 0;
        
        // Back-calculate percentage from Toman profit and totalCost
        const percentage = totalCost > 0 ? (numericToman / totalCost) * 100 : 0;
        
        // Round to 2 decimal places to keep the percentage input display clean and user-friendly
        const roundedPercent = Math.round(percentage * 100) / 100;
        onUpdateField('profitMargin', roundedPercent.toString());
    };

    return (
        <Card className="rounded-2xl gap-4">
            <Input
                label="هزینه های مازاد بر تولید (آب، برق، گاز، کارگر و ...)"
                placeholder=""
                prefixText="تومان"
                keyboardType="numeric"
                value={displayOverheadValue}
                onChangeText={handleOverheadChange}
            />
            
            <View className="h-px bg-bakery-border opacity-20 my-1" />

            <View className="flex-row gap-2">
                <View className="flex-1">
                    <Input
                        label="میزان سود (تومان)"
                        placeholder="سود به تومان"
                        prefixText="تومان"
                        keyboardType="numeric"
                        value={displayTomanValue}
                        onChangeText={handleTomanChange}
                    />
                </View>
                <View className="w-28">
                    <Input
                        label="سود (درصد)"
                        placeholder="سود٪"
                        prefixText="٪"
                        keyboardType="numeric"
                        value={displayPercentValue}
                        onChangeText={handlePercentChange}
                    />
                </View>
            </View>
        </Card>
    );
});

OverheadCostCard.displayName = 'OverheadCostCard';
