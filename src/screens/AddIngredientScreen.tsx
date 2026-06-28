import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IngredientFormFields } from '../components/ingredients/IngredientFormFields';
import { useApp } from '../context/AppContext';
import { NewIngredient } from '../types';

interface AddIngredientScreenProps {
    onBack: () => void;
}

export const AddIngredientScreen = ({ onBack }: AddIngredientScreenProps) => {
    const { addIngredient, units, ingredients, showToast } = useApp();
    const [name, setName] = useState('');
    const [unitId, setUnitId] = useState('');
    const [price, setPrice] = useState('');



    const handleSubmit = useCallback(async () => {
        if (!name || !price || !unitId) return;
        
        const trimmedName = name.trim();
        const isDuplicate = ingredients.some(
            ing => ing.name.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (isDuplicate) {
            showToast('ماده اولیه‌ای با این نام قبلاً ثبت شده است.', 'error');
            return;
        }

        const p = parseFloat(price) || 0;
        await addIngredient({ name: trimmedName, unitId, price: p } as NewIngredient);
        onBack();
    }, [name, price, unitId, addIngredient, ingredients, showToast, onBack]);

    return (
        <Screen>
            <Header title="ثبت ماده اولیه جدید" onBack={onBack} />

            <View className="px-4 pb-24 gap-4">
                <Card className="gap-5 p-5">
                    <IngredientFormFields
                        name={name}
                        onChangeName={setName}
                        unitId={unitId}
                        onChangeUnitId={setUnitId}
                        price={price}
                        onChangePrice={setPrice}
                        units={units}
                    />
                </Card>

                <Button
                    variant="primary"
                    size="lg"
                    label="ذخیره ماده اولیه"
                    onPress={handleSubmit}
                    disabled={!name || !price || !unitId}
                    className={!name || !price || !unitId ? 'opacity-50' : ''}
                />
            </View>
        </Screen>
    );
};
