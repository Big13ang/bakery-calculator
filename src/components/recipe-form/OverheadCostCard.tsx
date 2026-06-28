import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatNumberWithCommas, toEnglishDigits } from '../../utils';

interface OverheadCostCardProps {
    overheadCost: string;
    onUpdateField: (key: 'overheadCost', value: string) => void;
}

export const OverheadCostCard = ({ overheadCost, onUpdateField }: OverheadCostCardProps) => {
    const displayValue = formatNumberWithCommas(overheadCost);

    const handleChangeText = (val: string) => {
        // Strip commas and non-digits to get raw English digits for state
        const cleanVal = toEnglishDigits(val).replace(/[^0-9]/g, '');
        onUpdateField('overheadCost', cleanVal);
    };

    return (
        <Card className="rounded-2xl gap-4">
            <Input
                label="هزینه های مازاد بر تولید (آب، برق، گاز، کارگر و ...)"
                placeholder=""
                prefixText="تومان"
                keyboardType="numeric"
                value={displayValue}
                onChangeText={handleChangeText}
            />
        </Card>
    );
};
