import React from 'react';
import { View } from 'react-native';
import { Input } from '../ui/Input';
import Select from '../ui/Select';
import { Unit } from '../../types';

interface IngredientFormFieldsProps {
    name: string;
    onChangeName: (val: string) => void;
    unitId: string;
    onChangeUnitId: (val: string) => void;
    price: string;
    onChangePrice: (val: string) => void;
    units: Unit[];
}

export const IngredientFormFields = ({
    name,
    onChangeName,
    unitId,
    onChangeUnitId,
    price,
    onChangePrice,
    units,
}: IngredientFormFieldsProps) => {
    const unitOptions = units.map(u => ({ label: u.name, value: u.id }));

    return (
        <View className="gap-5">
            <Input
                label="نام ماده اولیه"
                placeholder="مثال: آرد نول"
                value={name}
                onChangeText={onChangeName}
                className="text-right"
            />
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <Select
                        label="واحد"
                        value={unitId}
                        options={unitOptions}
                        onChange={onChangeUnitId}
                        placeholder="انتخاب"
                    />
                </View>
                <View className="flex-1">
                    <Input
                        label="قیمت هر واحد"
                        placeholder="تومان"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={onChangePrice}
                        className="text-right"
                    />
                </View>
            </View>
        </View>
    );
};
