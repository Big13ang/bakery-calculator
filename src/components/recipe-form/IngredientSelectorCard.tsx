import React, { memo, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { RecipeIngredient } from '../../types';
import { formatPrice } from '../../utils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Icons } from '../ui/Icons';
import Select from '../ui/Select';
import { Typography } from '../ui/Typography';
import { AddIngredientModal } from './AddIngredientModal';

interface IngredientSelectorCardProps {
    ingredients: any[];
    units: any[];
    selectedIngredients: RecipeIngredient[];
    currentIngId: string;
    currentQty: string;
    onUpdateField: (key: 'currentIngId' | 'currentQty', value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export const IngredientSelectorCard = memo(({
    ingredients,
    units,
    selectedIngredients,
    currentIngId,
    currentQty,
    onUpdateField,
    onAdd,
    onRemove,
}: IngredientSelectorCardProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <Card className="rounded-2xl gap-4">
            <Typography variant="micro" className="opacity-60 uppercase pb-2 border-b border-bakery-border border-dashed">
                مواد اولیه مصرفی
            </Typography>

            {/* Ingredient Selector Area */}
            <View className="gap-3">
                <View className="flex-row justify-between items-center px-1">
                    <Typography variant="micro" className="opacity-80 text-left">
                        انتخاب ماده اولیه
                    </Typography>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} className="flex-row items-center gap-1">
                        <Icons.Plus size={14} color="#D97706" />
                        <Typography variant="micro" className="text-[#D97706] font-bold">
                            ماده اولیه جدید
                        </Typography>
                    </TouchableOpacity>
                </View>
                <Select
                    value={currentIngId}
                    searchable
                    options={ingredients.map(ing => {
                        const u = units.find(unit => unit.id === ing.unitId);
                        return {
                            label: ing.name,
                            value: ing.id,
                            price: ing.price,
                            unit: u?.name || '-'
                        };
                    })}
                    onChange={(val: string) => onUpdateField('currentIngId', val)}
                    placeholder="انتخاب ماده..."
                />

                <View className="flex-row gap-3">
                    <TextInput
                        className="flex-1 p-4 rounded-xl bg-bakery-soft border border-bakery-border font-body text-bakery-text text-xs"
                        placeholder="مقدار"
                        keyboardType="numeric"
                        value={currentQty}
                        onChangeText={val => onUpdateField('currentQty', val)}
                    />
                    <Button variant="primary" size="icon" onPress={onAdd} className="w-14 h-14 rounded-xl items-center justify-center">
                        <Icons.Plus size={24} color="white" />
                    </Button>
                </View>
            </View>

            {/* List of selected ingredients */}
            <View className="gap-2">
                {selectedIngredients.map((item, idx) => {
                    const ing = ingredients.find(i => i.id === item.ingredientId);
                    const unitName = units.find(u => u.id === ing?.unitId)?.name || '';
                    const itemPrice = (item.quantity || 0) * (ing?.price || 0);
                    return (
                        <View
                            key={idx}
                            className="flex-row justify-between items-center bg-bakery-soft p-4 rounded-xl border border-bakery-border"
                            style={{ direction: 'rtl' }}
                        >
                            {/* Right side: Ingredient name and unit rate */}
                            <View className="flex-col gap-0.5">
                                <Typography variant="caption" className="font-black text-left">
                                    {ing?.name || 'ماده نامشخص'}
                                </Typography>
                                <Typography variant="micro" className="opacity-55 text-left text-[10px]">
                                    {formatPrice(ing?.price || 0)} تومان / {unitName || '-'}
                                </Typography>
                            </View>

                            {/* Left side: Quantity/Total and Delete */}
                            <View className="flex-row items-center gap-3">
                                <View className="gap-0.5">
                                    <Typography variant="micro" className="opacity-75 text-right text-[10px]">
                                        {item.quantity} {unitName}
                                    </Typography>
                                    <Typography variant="caption" className="font-bold text-bakery-accent text-right">
                                        {formatPrice(itemPrice)} تومان
                                    </Typography>
                                </View>
                                <TouchableOpacity
                                    onPress={() => onRemove(idx)}
                                    className="p-2.5 bg-red-50/80 active:bg-red-100 rounded-xl border border-red-100/50 active:scale-95"
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Icons.Trash size={14} color="#7C2D12" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Add Ingredient Modal */}
            <AddIngredientModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSaveSuccess={(newIngId) => {
                    onUpdateField('currentIngId', newIngId);
                }}
            />
        </Card>
    );
});

IngredientSelectorCard.displayName = 'IngredientSelectorCard';

