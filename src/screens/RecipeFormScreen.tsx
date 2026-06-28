import { useCallback, useEffect, useReducer, useState } from 'react';
import { View } from 'react-native';
import { Header } from '../components/layout/Header';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { RecipeIngredient } from '../types';
import { toEnglishDigits } from '../utils';

import { IngredientSelectorCard } from '../components/recipe-form/IngredientSelectorCard';
import { ProductInfoCard } from '../components/recipe-form/ProductInfoCard';
import { RecipeSummaryCard } from '../components/recipe-form/RecipeSummaryCard';
import { OverheadCostCard } from '../components/recipe-form/OverheadCostCard';
import { formReducer } from '../components/recipe-form/reducer';
import { FormState } from '../components/recipe-form/types';

interface RecipeFormScreenProps {
    onBack: () => void;
    editRecipeId?: string | null;
}

export const RecipeFormScreen = ({ onBack, editRecipeId }: RecipeFormScreenProps) => {
    const { ingredients, recipes, addRecipe, updateRecipe, calculateDraftCosts, units, showToast } = useApp();

    const r = editRecipeId ? recipes.find(rec => rec.id === editRecipeId) : undefined;

    // Flux pattern state reducer
    const [state, dispatch] = useReducer(formReducer, {
        name: r?.name ?? '',
        outputCount: r?.outputCount.toString() ?? '1',
        outputUnitId: r?.outputUnitId || '',
        profitMargin: r?.profitMargin.toString() ?? '30',
        overheadCost: r?.overheadCost && r.overheadCost !== 0 ? r.overheadCost.toString() : '',
        selectedIngredients: ((r?.ingredients as any) ?? []) as RecipeIngredient[],
        currentIngId: '',
        currentQty: '',
    });

    const { name, outputCount, outputUnitId, profitMargin, overheadCost, selectedIngredients, currentIngId, currentQty } = state;

    const handleUpdateField = useCallback((key: keyof FormState, value: any) => {
        dispatch({ type: 'UPDATE_FIELD', key, value });
    }, []);

    const addIngredient = useCallback(() => {
        if (!currentIngId || !currentQty) return;
        const qtyToAdd = parseFloat(toEnglishDigits(currentQty)) || 0;

        // Side effect: Toast notification
        const existingIdx = selectedIngredients.findIndex(item => item.ingredientId === currentIngId);
        if (existingIdx > -1) {
            const prevQty = Number(selectedIngredients[existingIdx].quantity) || 0;
            const newQty = prevQty + qtyToAdd;
            const ing = ingredients.find(i => i.id === currentIngId);
            const unitName = units.find(u => u.id === ing?.unitId)?.name || '';
            showToast(`مقدار ${ing?.name || 'ماده'} با موفقیت ادغام شد و به ${newQty} ${unitName} تغییر یافت.`, 'success');
        }

        dispatch({ type: 'ADD_INGREDIENT', ingredientId: currentIngId, quantity: qtyToAdd });
    }, [currentIngId, currentQty, selectedIngredients, ingredients, units, showToast]);

    const removeIngredient = useCallback((index: number) => {
        dispatch({ type: 'REMOVE_INGREDIENT', index });
    }, []);

    const handleSubmit = async () => {
        if (!name.trim() || selectedIngredients.length === 0) return;
        const out = parseFloat(outputCount) || 1;
        const prof = parseFloat(profitMargin) || 0;
        const overhead = parseFloat(toEnglishDigits(overheadCost)) || 0;
        const payloadIngredients = selectedIngredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity }));

        if (editRecipeId) {
            await updateRecipe(editRecipeId, {
                name: name.trim(),
                outputCount: out,
                outputUnitId,
                profitMargin: prof,
                overheadCost: overhead,
            }, payloadIngredients);
        } else {
            await addRecipe({
                name: name.trim(),
                outputCount: out,
                outputUnitId,
                profitMargin: prof,
                overheadCost: overhead,
                ingredients: payloadIngredients,
            } as any);
        }
        onBack();
    };

    const [debouncedSummary, setDebouncedSummary] = useState(() => 
        calculateDraftCosts({
            ingredients: selectedIngredients,
            outputCount: parseFloat(outputCount) || 1,
            profitMargin: parseFloat(profitMargin) || 0,
            overheadCost: parseFloat(toEnglishDigits(overheadCost)) || 0
        })
    );
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setIsPending(true);
        const timer = setTimeout(() => {
            const result = calculateDraftCosts({
                ingredients: selectedIngredients,
                outputCount: parseFloat(outputCount) || 1,
                profitMargin: parseFloat(profitMargin) || 0,
                overheadCost: parseFloat(toEnglishDigits(overheadCost)) || 0
            });
            setDebouncedSummary(result);
            setIsPending(false);
        }, 200); // 200ms debounce for calculations

        return () => clearTimeout(timer);
    }, [selectedIngredients, outputCount, profitMargin, overheadCost, calculateDraftCosts]);

    const isSubmitDisabled = !name.trim() || selectedIngredients.length === 0;

    const currentTotalCost = (() => {
        const ingredientsCost = selectedIngredients.reduce((sum, ri) => {
            const ing = ingredients.find(i => i.id === ri.ingredientId);
            return sum + (ing ? ri.quantity * ing.price : 0);
        }, 0);
        const overhead = parseFloat(toEnglishDigits(overheadCost)) || 0;
        return ingredientsCost + overhead;
    })();

    return (
        <Screen className="p-4 pt-1">
            <Header title={editRecipeId ? "ویرایش دستور پخت" : "افزودن دستور پخت"} onBack={onBack} />

            <View className="px-0 pb-24 gap-5">
                <ProductInfoCard
                    name={name}
                    outputCount={outputCount}
                    outputUnitId={outputUnitId}
                    units={units}
                    onUpdateField={handleUpdateField}
                />

                <IngredientSelectorCard
                    ingredients={ingredients}
                    units={units}
                    selectedIngredients={selectedIngredients}
                    currentIngId={currentIngId}
                    currentQty={currentQty}
                    onUpdateField={handleUpdateField}
                    onAdd={addIngredient}
                    onRemove={removeIngredient}
                />

                <OverheadCostCard
                    overheadCost={overheadCost}
                    profitMargin={profitMargin}
                    totalCost={currentTotalCost}
                    onUpdateField={handleUpdateField}
                />

                {selectedIngredients.length > 0 && (
                    <RecipeSummaryCard
                        summary={debouncedSummary}
                        outputUnitId={outputUnitId}
                        units={units}
                        isPending={isPending}
                    />
                )}

                <Button
                    variant="primary"
                    label={editRecipeId ? "به‌روزرسانی دستور پخت" : "تایید و ثبت نهایی"}
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                    className={isSubmitDisabled ? "opacity-50" : ""}
                />
            </View>
        </Screen>
    );
};




