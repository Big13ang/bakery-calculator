import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ingredientService } from '../services/IngredientService';
import { recipeService } from '../services/RecipeService';
import { settingsService } from '../services/SettingsService';
import { unitService } from '../services/UnitService';
import { AppSettings, Ingredient, NewIngredient, NewRecipe, Recipe, RecipeWithIngredients, Unit } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
    businessName: '',
    ownerName: '',
    subscriptionStatus: 'free',
};

interface AppContextType {
    ingredients: Ingredient[];
    recipes: RecipeWithIngredients[];
    units: Unit[];
    settings: AppSettings;
    isLoading: boolean;
    refreshData: () => Promise<void>;

    // Ingredient Actions
    addIngredient: (data: NewIngredient) => Promise<void>;
    updateIngredientPrice: (id: string, newPrice: number) => Promise<void>;
    updateIngredient: (id: string, data: Partial<Ingredient>) => Promise<void>;
    deleteIngredient: (id: string) => Promise<void>;

    // Recipe Actions
    addRecipe: (data: NewRecipe & { ingredients?: { ingredientId: string, quantity: number }[] }) => Promise<string>; // Returns ID
    updateRecipe: (id: string, updates: Partial<Recipe>, newIngredients?: { ingredientId: string, quantity: number }[]) => Promise<void>;
    addIngredientToRecipe: (recipeId: string, ingredientId: string, quantity: number) => Promise<void>;
    recalculateRecipe: (recipeId: string) => Promise<void>;
    deleteRecipe: (id: string) => Promise<void>;

    // Calculation Helper - purely utility, or should likely be in Service?
    // Keeping here for UI convenience but it should probably use Service logic to act on "draft" recipes
    calculateDraftCosts: (recipe: Partial<Recipe> & { ingredients?: { ingredientId: string, quantity: number }[] }) => { costPerUnit: number; sellingPrice: number; totalCost: number; totalPrice: number; profit: number };

    // Settings Actions
    updateSetting: (key: string, value: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedIngredients, fetchedRecipes, fetchedUnits, fetchedSettings] = await Promise.all([
                ingredientService.getAllIngredients(),
                recipeService.getAllRecipes(),
                unitService.getAllUnits(),
                settingsService.getAppSettings()
            ]);

            setIngredients(fetchedIngredients);
            setRecipes(fetchedRecipes);
            setUnits(fetchedUnits);
            setSettings(fetchedSettings);
        } catch (error) {
            console.error("Failed to refresh data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // --- Ingredient Actions ---

    const addIngredient = async (data: NewIngredient) => {
        await ingredientService.createIngredient(data);
        await refreshData();
    };

    const updateIngredientPrice = async (id: string, newPrice: number) => {
        await ingredientService.updatePrice(id, newPrice);
        // Recalculate costs for all recipes using this ingredient
        await recipeService.updateCostsForIngredient(id, 'تغییر قیمت ماده اولیه');
        await refreshData();
    };

    const updateIngredient = async (id: string, data: Partial<Ingredient>) => {
        await ingredientService.updateIngredient(id, data);
        if (data.price !== undefined) {
            await recipeService.updateCostsForIngredient(id, 'بروزرسانی اطلاعات ماده اولیه');
        }
        await refreshData();
    };

    const deleteIngredient = async (id: string) => {
        await ingredientService.deleteIngredient(id);
        await refreshData();
    };

    // --- Recipe Actions ---

    const addRecipe = async (data: NewRecipe & { ingredients?: { ingredientId: string, quantity: number }[] }): Promise<string> => {
        const newRecipe = await recipeService.createRecipe(data);
        await refreshData();
        return newRecipe.id;
    };

    const updateRecipe = async (id: string, updates: Partial<Recipe>, newIngredients?: { ingredientId: string, quantity: number }[]) => {
        await recipeService.updateRecipe(id, updates, newIngredients);
        await refreshData();
    };

    const addIngredientToRecipe = async (recipeId: string, ingredientId: string, quantity: number) => {
        await recipeService.addIngredientToRecipe(recipeId, ingredientId, quantity);
        await refreshData();
    };

    const recalculateRecipe = async (recipeId: string) => {
        await recipeService.recalculateCosts(recipeId);
        await refreshData();
    };

    const deleteRecipe = async (id: string) => {
        await recipeService.deleteRecipe(id);
        await refreshData();
    };

    // --- Settings Actions ---

    const updateSetting = async (key: string, value: string) => {
        await settingsService.setSetting(key, value);
        setSettings(prev => ({ ...prev, [key]: value } as AppSettings));
    };

    // Helper for UI drafts
    const calculateDraftCosts = (recipe: Partial<Recipe> & { ingredients?: { ingredientId: string, quantity: number }[] }) => {
        let totalCost = 0;
        recipe.ingredients?.forEach((ri) => {
            const ing = ingredients.find((i) => i.id === ri.ingredientId);
            if (ing) totalCost += ri.quantity * ing.price;
        });
        const costPerUnit = totalCost / (recipe.outputCount || 1);
        const totalPrice = totalCost * (1 + (recipe.profitMargin || 0) / 100);
        const sellingPrice = totalPrice / (recipe.outputCount || 1); // This is price per unit
        const profit = totalPrice - totalCost;

        return { costPerUnit, sellingPrice, totalCost, totalPrice, profit };
    };

    return (
        <AppContext.Provider value={{
            ingredients,
            recipes,
            units,
            settings,
            isLoading,
            refreshData,
            addIngredient,
            updateIngredientPrice,
            updateIngredient,
            deleteIngredient,
            addRecipe,
            updateRecipe,
            addIngredientToRecipe,
            recalculateRecipe,
            deleteRecipe,
            calculateDraftCosts,
            updateSetting
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
