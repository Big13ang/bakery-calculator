import { useEffect, useState } from 'react';
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
    const { updateIngredient, ingredients, units } = useApp();
    const [name, setName] = useState('');
    const [unitId, setUnitId] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const ingredient = ingredients.find(i => i.id === ingredientId);
        if (ingredient) {
            setName(ingredient.name);
            setUnitId(ingredient.unitId);
            setPrice(ingredient.price.toString());
        }
    }, [ingredientId, ingredients]);

    const handleSubmit = async () => {
        if (!name || !price || !unitId) return;
        const p = parseFloat(price) || 0;

        const updates: Partial<Ingredient> = {
            name,
            unitId,
            price: p
        };

        await updateIngredient(ingredientId, updates);
        onBack();
    };

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
                                options={units.map(u => ({ label: u.name, value: u.id }))}
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
