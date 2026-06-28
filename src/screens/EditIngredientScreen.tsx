import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useApp } from '../context/AppContext';
import { Ingredient } from '../types';

interface EditIngredientScreenProps {
    ingredientId: string;
    onBack: () => void;
}

export const EditIngredientScreen = ({ ingredientId, onBack }: EditIngredientScreenProps) => {
    const { updateIngredient, ingredients, units, showToast } = useApp();
    const ingredient = ingredients.find(i => i.id === ingredientId);
    const [prevIngredient, setPrevIngredient] = useState<Ingredient | undefined>(undefined);
    const [name, setName] = useState(ingredient?.name ?? '');
    const [unitId, setUnitId] = useState(ingredient?.unitId ?? '');
    const [price, setPrice] = useState(ingredient?.price.toString() ?? '');

    if (ingredient && ingredient !== prevIngredient) {
        setPrevIngredient(ingredient);
        setName(ingredient.name);
        setUnitId(ingredient.unitId);
        setPrice(ingredient.price.toString());
    }

    const unitOptions = units.map(u => ({ label: u.name, value: u.id }));

    const handleSubmit = useCallback(async () => {
        if (!name || !price || !unitId) return;

        const trimmedName = name.trim();
        const isDuplicate = ingredients.some(
            ing => ing.id !== ingredientId && ing.name.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            showToast('ماده اولیه‌ای با این نام قبلاً ثبت شده است.', 'error');
            return;
        }

        const p = parseFloat(price) || 0;

        const updates: Partial<Ingredient> = {
            name: trimmedName,
            unitId,
            price: p
        };

        await updateIngredient(ingredientId, updates);
        onBack();
    }, [ingredientId, name, price, unitId, updateIngredient, ingredients, showToast, onBack]);

    return (
        <Screen>
            <Header title="ویرایش ماده اولیه" onBack={onBack} />

            <View className="px-4 pb-24 gap-4">
                <Card className="gap-5 p-5">
                    <Input
                        label="نام ماده اولیه"
                        placeholder="مثال: آرد نول"
                        value={name}
                        onChangeText={setName}
                        className="text-right"
                    />
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Select
                                label="واحد"
                                value={unitId}
                                options={unitOptions}
                                onChange={setUnitId}
                                placeholder="انتخاب"
                            />
                        </View>
                        <View className="flex-1">
                            <Input
                                label="قیمت هر واحد"
                                placeholder="تومان"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                                className="text-right"
                            />
                        </View>
                    </View>
                </Card>

                <Button
                    variant="primary"
                    size="lg"
                    label="به‌روزرسانی ماده اولیه"
                    onPress={handleSubmit}
                    disabled={!name || !price || !unitId}
                    className={!name || !price || !unitId ? 'opacity-50' : ''}
                />
            </View>
        </Screen>
    );
};
