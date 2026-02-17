import { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Input } from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';
import { Recipe, RecipeIngredient } from '../types';
import { formatPrice, generateId } from '../utils';

interface RecipeFormScreenProps {
    onBack: () => void;
    editRecipeId?: string | null;
}

const UNITS = ['کیلوگرم', 'گرم', 'عدد', 'بسته', 'قرص', 'لیتر', 'میلی‌لیتر'];

export const RecipeFormScreen = ({ onBack, editRecipeId }: RecipeFormScreenProps) => {
    const { ingredients, recipes, setRecipes, calculateRecipeCosts } = useApp();

    const [name, setName] = useState('');
    const [outputCount, setOutputCount] = useState('1');
    const [outputUnit, setOutputUnit] = useState(UNITS[0]);
    const [profitMargin, setProfitMargin] = useState('30');
    const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);

    // Ingredient adding state
    const [currentIngId, setCurrentIngId] = useState('');
    const [currentQty, setCurrentQty] = useState('');

    useEffect(() => {
        if (editRecipeId) {
            const r = recipes.find(r => r.id === editRecipeId);
            if (r) {
                setName(r.name);
                setOutputCount(r.outputCount.toString());
                setOutputUnit(r.outputUnit);
                setProfitMargin(r.profitMargin.toString());
                setSelectedIngredients(r.ingredients);
            }
        }
    }, [editRecipeId, recipes]);

    const handleSubmit = () => {
        if (!name || selectedIngredients.length === 0) return;
        const out = parseFloat(outputCount) || 1;
        const prof = parseFloat(profitMargin) || 0;

        // Calculate costs
        const temp: Partial<Recipe> = { ingredients: selectedIngredients, outputCount: out, profitMargin: prof };
        const { costPerUnit, sellingPrice, totalCost } = calculateRecipeCosts(temp);

        if (editRecipeId) {
            setRecipes(prev => prev.map(r => r.id === editRecipeId ? {
                ...r,
                name,
                ingredients: selectedIngredients,
                outputCount: out,
                outputUnit,
                profitMargin: prof,
                currentCost: totalCost,
                currentPrice: sellingPrice * out,
                priceHistory: [...r.priceHistory, { timestamp: Date.now(), costPerUnit, sellingPrice, reason: 'ویرایش دستور پخت' }]
            } : r));
        } else {
            const newRecipe: Recipe = {
                id: generateId(),
                name,
                ingredients: selectedIngredients,
                outputCount: out,
                outputUnit,
                profitMargin: prof,
                currentCost: totalCost,
                currentPrice: sellingPrice * out,
                priceHistory: [{ timestamp: Date.now(), costPerUnit, sellingPrice, reason: 'ثبت اولیه' }]
            };
            setRecipes(prev => [...prev, newRecipe]);
        }
        onBack();
    };

    const addIngredient = () => {
        if (!currentIngId || !currentQty) return;
        setSelectedIngredients([...selectedIngredients, { ingredientId: currentIngId, quantity: parseFloat(currentQty) || 0 }]);
        setCurrentIngId('');
        setCurrentQty('');
    };

    const removeIngredient = (index: number) => {
        setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const summary = calculateRecipeCosts({ ingredients: selectedIngredients, outputCount: parseFloat(outputCount) || 1, profitMargin: parseFloat(profitMargin) || 0 });

    return (
        <Screen className="p-4 pt-1">
            <Header title={editRecipeId ? "ویرایش دستور پخت" : "افزودن دستور پخت"} onBack={onBack} />

            <View className="px-0 pb-24 gap-5">
                <Card className="rounded-2xl gap-4">
                    <Input
                        label="نام محصول نهایی"
                        placeholder="مثال: کیک شکلاتی"
                        value={name}
                        onChangeText={setName}
                    />
                    <View className="flex-row gap-2">
                        <View className="flex-1">
                            <Input label="وزن تولید" keyboardType="numeric" value={outputCount} onChangeText={setOutputCount} />
                        </View>
                        <View className="flex-1 gap-2">
                            <Select
                                label="واحد"
                                value={outputUnit}
                                options={UNITS}
                                onChange={(val: string) => setOutputUnit(val)}
                                placeholder="انتخاب"
                            />
                        </View>
                        <View className="flex-1">
                            <Input label="سود٪" keyboardType="numeric" value={profitMargin} onChangeText={setProfitMargin} />
                        </View>
                    </View>
                </Card>

                <Card className="rounded-2xl gap-4">
                    <Typography variant="micro" className="opacity-60 uppercase pb-2 border-b border-bakery-border border-dashed">مواد اولیه مصرفی</Typography>

                    {/* Ingredient Selector Area */}
                    <View className="gap-3">
                        <Select
                            label="انتخاب ماده از انبار"
                            value={currentIngId}
                            options={ingredients.map(ing => ({
                                label: `${ing.name} (${ing.unit})`,
                                value: ing.id
                            }))}
                            onChange={(val: string) => setCurrentIngId(val)}
                            placeholder="انتخاب ماده..."
                        />

                        <View className="flex-row gap-3">
                            <TextInput
                                className="flex-1 p-4 rounded-xl bg-bakery-soft border border-bakery-border font-body text-bakery-text text-xs"
                                placeholder="مقدار"
                                keyboardType="numeric"
                                value={currentQty}
                                onChangeText={setCurrentQty}
                            />
                            <Button variant="primary" size="icon" onPress={addIngredient} className="w-14 h-14 rounded-xl items-center justify-center">
                                <Icons.Plus size={24} color="white" />
                            </Button>
                        </View>
                    </View>

                    {/* List of selected ingredients */}
                    <View className="gap-2">
                        {selectedIngredients.map((item, idx) => {
                            const ing = ingredients.find(i => i.id === item.ingredientId);
                            return (
                                <View key={idx} className="flex-row justify-between items-center bg-bakery-soft p-4 rounded-xl border border-bakery-border">
                                    <Typography variant="caption" className="font-black">{ing?.name}</Typography>
                                    <View className="flex-row items-center gap-3">
                                        <Typography variant="micro" className="opacity-80">{item.quantity} {ing?.unit}</Typography>
                                        <TouchableOpacity onPress={() => removeIngredient(idx)} className="p-2 bg-red-100 rounded-lg">
                                            <Icons.Trash size={14} color="#7C2D12" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {selectedIngredients.length > 0 && (
                    <Card className="bg-[#F9F1E5] rounded-2xl gap-4 border-bakery-accent/20">
                        <View className="flex-row items-center gap-2 border-b border-dashed border-bakery-border pb-2">
                            <Icons.TrendingUp size={16} color="#D97706" />
                            <Typography variant="h3" className="text-sm">خلاصه محاسبات</Typography>
                        </View>
                        <View className="gap-2.5">
                            <View className="flex-row justify-between"><Typography variant="micro" className="opacity-70">هزینه کل مواد اولیه:</Typography><Typography variant="micro" className="font-black">{formatPrice(summary.totalCost)} تومان</Typography></View>
                            <View className="flex-row justify-between"><Typography variant="micro" className="opacity-70">قیمت تمام شده هر {outputUnit}:</Typography><Typography variant="micro" className="font-black">{formatPrice(summary.costPerUnit)} تومان</Typography></View>
                            <View className="flex-row justify-between"><Typography variant="micro" className="text-bakery-accent">قیمت فروش هر {outputUnit} ({profitMargin}%):</Typography><Typography variant="micro" className="text-bakery-accent font-black">{formatPrice(summary.sellingPrice)} تومان</Typography></View>
                            <View className="h-px bg-bakery-border opacity-30 my-1" />
                            <View className="flex-row justify-between"><Typography variant="body" className="uppercase font-black">قیمت فروش کل:</Typography><Typography variant="body" className="font-black">{formatPrice(summary.sellingPrice * (parseFloat(outputCount) || 1))} تومان</Typography></View>
                        </View>
                    </Card>
                )}

                <Button
                    variant="primary"
                    label={editRecipeId ? "به‌روزرسانی دستور پخت" : "تایید و ثبت نهایی"}
                    onPress={handleSubmit}
                    disabled={!name || selectedIngredients.length === 0}
                    className={!name || selectedIngredients.length === 0 ? "opacity-50" : ""}
                />
            </View>
        </Screen>
    );
};
