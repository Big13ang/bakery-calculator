import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { DeleteConfirmation } from '../components/common/DeleteConfirmation';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icons';
import { Typography } from '../components/ui/Typography';
import { useApp } from '../context/AppContext';

interface IngredientsScreenProps {
    onBack: () => void;
    onAdd: () => void;
}

export const IngredientsScreen = ({ onBack, onAdd }: IngredientsScreenProps) => {
    const { ingredients, setIngredients, setRecipes } = useApp();
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const handleUpdatePrice = (id: string, newPrice: string) => {
        const val = parseFloat(newPrice) || 0;
        const updatedIngredients = ingredients.map(ing => (ing.id === id ? { ...ing, pricePerUnit: val, lastUpdated: Date.now() } : ing));
        setIngredients(updatedIngredients);

        // Simplistic update for recipes (context logic replica)
        setRecipes(prevRecipes => prevRecipes.map(recipe => {
            if (recipe.ingredients.some(ri => ri.ingredientId === id)) {
                let totalRecCost = 0;
                recipe.ingredients.forEach(ri => {
                    const ing = updatedIngredients.find(i => i.id === ri.ingredientId);
                    if (ing) totalRecCost += ri.quantity * ing.pricePerUnit;
                });
                const rCost = totalRecCost;
                const rCostPerUnit = rCost / (recipe.outputCount || 1);
                const rSelling = rCostPerUnit * (1 + (recipe.profitMargin || 0) / 100);

                return {
                    ...recipe,
                    currentCost: rCost,
                    currentPrice: rSelling * recipe.outputCount,
                    priceHistory: [...recipe.priceHistory, { timestamp: Date.now(), costPerUnit: rCostPerUnit, sellingPrice: rSelling, reason: 'به‌روزرسانی قیمت مواد' }]
                };
            }
            return recipe;
        }));
    };

    const handleDelete = (id: string) => {
        setIngredients(prev => prev.filter(i => i.id !== id));
    };

    return (
        <Screen className="p-4 pt-1">
            <Header
                title="مواد اولیه انبار"
                onBack={onBack}
                actionButton={
                    <Button variant="primary" size="icon" onPress={onAdd} className="rounded-xl w-10 h-10 p-0 items-center justify-center shadow-md">
                        <Icons.Plus size={20} color="white" />
                    </Button>
                }
                className="mb-6"
            />

            <View className="px-0 pb-32">
                {ingredients.map(ing => (
                    <Card key={ing.id} className="p-5 flex-row items-center justify-between mb-5">
                        <View className="flex-col">
                            <Typography variant="body" className="font-black text-base">{ing.name}</Typography>
                            <Typography variant="micro" className="opacity-60 text-[10px] text-left">واحد: {ing.unit}</Typography>
                        </View>
                        <View className="flex-row items-center gap-4">
                            <TextInput
                                keyboardType="numeric"
                                defaultValue={ing.pricePerUnit.toString()}
                                onChangeText={(text) => handleUpdatePrice(ing.id, text)}
                                className="w-28 text-left font-body font-black text-sm bg-bakery-soft p-2.5 rounded-xl border border-bakery-border text-bakery-text"
                            />
                            <Button
                                variant="danger"
                                size="icon"
                                className="w-10 h-10 p-0 items-center justify-center rounded-xl bg-bakery-soft border-bakery-border"
                                onPress={() => setIdToDelete(ing.id)}
                            >
                                <Icons.Trash size={18} color="#7C2D12" />
                            </Button>
                        </View>
                    </Card>
                ))}
            </View>

            <DeleteConfirmation
                visible={!!idToDelete}
                onCancel={() => setIdToDelete(null)}
                onConfirm={() => {
                    if (idToDelete) {
                        setIngredients(prev => prev.filter(i => i.id !== idToDelete));
                        setIdToDelete(null);
                    }
                }}
            />
        </Screen>
    );
};
