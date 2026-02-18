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
import { RecipeIngredient } from '../types';
import { formatPrice } from '../utils';

interface RecipeFormScreenProps {
    onBack: () => void;
    editRecipeId?: string | null;
}

export const RecipeFormScreen = ({ onBack, editRecipeId }: RecipeFormScreenProps) => {
    const { ingredients, recipes, addRecipe, updateRecipe, calculateDraftCosts, units } = useApp();

    const [name, setName] = useState('');
    const [outputCount, setOutputCount] = useState('1');
    const [outputUnitId, setOutputUnitId] = useState('');
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
                setOutputUnitId(r.outputUnitId || '');
                setProfitMargin(r.profitMargin.toString());
                setSelectedIngredients(r.ingredients as any); // Cast for simplicity in draft
            }
        }
    }, [editRecipeId, recipes]);

    const handleSubmit = async () => {
        if (!name || selectedIngredients.length === 0) return;
        const out = parseFloat(outputCount) || 1;
        const prof = parseFloat(profitMargin) || 0;

        if (editRecipeId) {
            await updateRecipe(editRecipeId, {
                name,
                outputCount: out,
                outputUnitId,
                profitMargin: prof,
            }, selectedIngredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity })));
        } else {
            await addRecipe({
                name,
                outputCount: out,
                outputUnitId,
                profitMargin: prof,
                ingredients: selectedIngredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity })),
            } as any);
        }
        onBack();
    };

    const addIngredient = () => {
        if (!currentIngId || !currentQty) return;
        setSelectedIngredients([...selectedIngredients, { ingredientId: currentIngId, quantity: parseFloat(currentQty) || 0 } as any]);
        setCurrentIngId('');
        setCurrentQty('');
    };

    const removeIngredient = (index: number) => {
        setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const summary = calculateDraftCosts({ ingredients: selectedIngredients, outputCount: parseFloat(outputCount) || 1, profitMargin: parseFloat(profitMargin) || 0 });

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
                                value={outputUnitId}
                                options={units.map(u => ({ label: u.name, value: u.id }))}
                                onChange={(val: string) => setOutputUnitId(val)}
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
                            label="انتخاب ماده اولیه"
                            value={currentIngId}
                            options={ingredients.map(ing => {
                                const u = units.find(unit => unit.id === ing.unitId);
                                return {
                                    label: `${ing.name} (${u?.name || '-'})`,
                                    value: ing.id
                                };
                            })}
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
                                        <Typography variant="micro" className="opacity-80">{item.quantity} {units.find(u => u.id === ing?.unitId)?.name}</Typography>
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
                            <View className="flex-row justify-between"><Typography variant="micro" className="opacity-70">قیمت تمام شده هر {units.find(u => u.id === outputUnitId)?.name || '-'}:</Typography><Typography variant="micro" className="font-black">{formatPrice(summary.costPerUnit)} تومان</Typography></View>
                            <View className="flex-row justify-between"><Typography variant="micro" className="text-bakery-accent/80">قیمت فروش هر {units.find(u => u.id === outputUnitId)?.name || '-'}:</Typography><Typography variant="micro" className="text-bakery-accent/80 font-black">{formatPrice(summary.sellingPrice)} تومان</Typography></View>
                            <View className="h-px bg-bakery-border opacity-30 my-1" />
                            <View className="flex-row justify-between"><Typography variant="body" className="uppercase font-black">قیمت فروش کل:</Typography><Typography variant="body" className="font-black">{formatPrice(summary.totalPrice)} تومان</Typography></View>
                            <View className="flex-row justify-between bg-bakery-accent/5 p-2 rounded-lg border border-bakery-accent/10"><Typography variant="body" className="text-bakery-accent font-black">سود خالص کل:</Typography><Typography variant="body" className="text-bakery-accent font-black">{formatPrice(summary.profit)} تومان</Typography></View>
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
