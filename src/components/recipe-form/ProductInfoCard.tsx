import React, { memo } from 'react';
import { View } from 'react-native';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import Select from '../ui/Select';

interface ProductInfoCardProps {
    name: string;
    outputCount: string;
    outputUnitId: string;
    profitMargin: string;
    units: { id: string; name: string }[];
    onUpdateField: (key: 'name' | 'outputCount' | 'outputUnitId' | 'profitMargin', value: string) => void;
}

export const ProductInfoCard = memo(({
    name,
    outputCount,
    outputUnitId,
    profitMargin,
    units,
    onUpdateField,
}: ProductInfoCardProps) => (
    <Card className="rounded-2xl gap-4">
        <Input
            label="نام محصول نهایی"
            placeholder="مثال: کیک شکلاتی"
            value={name}
            onChangeText={val => onUpdateField('name', val)}
        />
        <View className="flex-row gap-2">
            <View className="flex-1">
                <Input
                    label="وزن تولید"
                    keyboardType="numeric"
                    value={outputCount}
                    onChangeText={val => onUpdateField('outputCount', val)}
                />
            </View>
            <View className="flex-1 gap-2">
                <Select
                    label="واحد"
                    value={outputUnitId}
                    options={units.map(u => ({ label: u.name, value: u.id }))}
                    onChange={(val: string) => onUpdateField('outputUnitId', val)}
                    placeholder="انتخاب"
                />
            </View>
            <View className="flex-1">
                <Input
                    label="سود٪"
                    keyboardType="numeric"
                    value={profitMargin}
                    onChangeText={val => onUpdateField('profitMargin', val)}
                />
            </View>
        </View>
    </Card>
));

ProductInfoCard.displayName = 'ProductInfoCard';
