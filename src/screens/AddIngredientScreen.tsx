import { useState } from 'react';
import { View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils';

interface AddIngredientScreenProps {
    onBack: () => void;
}

const UNITS = ['کیلوگرم', 'گرم', 'عدد', 'بسته', 'قرص', 'لیتر', 'میلی لیتر'];

export const AddIngredientScreen = ({ onBack }: AddIngredientScreenProps) => {
    const { ingredients, setIngredients } = useApp();
    const [name, setName] = useState('');
    const [unit, setUnit] = useState(UNITS[0]);
    const [price, setPrice] = useState('');

    const handleSubmit = () => {
        if (!name || !price) return;
        const p = parseFloat(price) || 0;
        setIngredients([...ingredients, { id: generateId(), name, unit, pricePerUnit: p, lastUpdated: Date.now() }]);
        onBack();
    };

    return (
        <Screen>
            <Header title="ثبت ماده اولیه جدید" onBack={onBack} />

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
                                value={unit}
                                options={UNITS}
                                onChange={setUnit}
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
                    label="ذخیره در انبار"
                    onPress={handleSubmit}
                    disabled={!name || !price}
                    className={!name || !price ? 'opacity-50' : ''}
                />
            </View>
        </Screen>
    );
};
