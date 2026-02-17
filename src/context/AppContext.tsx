import SQLiteKVStore from 'expo-sqlite/kv-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, AppState, Ingredient, Recipe } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
    businessName: '',
    ownerName: '',
    subscriptionStatus: 'free',
};

const MOCK_INGREDIENTS: Ingredient[] = [
    { id: 'i1', name: 'آرد نول ۱۸٪', unit: 'کیلوگرم', pricePerUnit: 72000, lastUpdated: Date.now() },
    { id: 'i2', name: 'شکر دانه درشت', unit: 'کیلوگرم', pricePerUnit: 48000, lastUpdated: Date.now() },
    { id: 'i3', name: 'کره گیاهی ویژه', unit: 'کیلوگرم', pricePerUnit: 290000, lastUpdated: Date.now() },
];

const MOCK_RECIPES: Recipe[] = [
    {
        id: 'r1',
        name: 'کیک شکلاتی مخصوص',
        ingredients: [
            { ingredientId: 'i2', quantity: 0.25 },
            { ingredientId: 'i1', quantity: 1.0 },
        ],
        outputCount: 10,
        outputUnit: 'کیلوگرم',
        profitMargin: 30,
        currentCost: 1275000,
        currentPrice: 1657500,
        priceHistory: [
            { timestamp: Date.now() - 86400000 * 20, costPerUnit: 100000, sellingPrice: 130000, reason: 'ثبت اولیه' },
            { timestamp: Date.now() - 86400000 * 10, costPerUnit: 110000, sellingPrice: 143000, reason: 'تغییر قیمت آرد' },
            { timestamp: Date.now(), costPerUnit: 127500, sellingPrice: 165750, reason: 'تغییر قیمت مواد' }
        ]
    }
];

interface AppContextType {
    ingredients: Ingredient[];
    recipes: Recipe[];
    settings: AppSettings;
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    calculateRecipeCosts: (recipe: Partial<Recipe>) => { costPerUnit: number; sellingPrice: number; totalCost: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
    const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        try {
            const saved = SQLiteKVStore.getItemSync('bakery_cost_pro_v21_final');
            if (saved) {
                const data: AppState = JSON.parse(saved);
                if (data.ingredients) setIngredients(data.ingredients);
                if (data.recipes) setRecipes(data.recipes);
                if (data.settings) setSettings(data.settings);
            }
        } catch (e) {
            console.error('Failed to load data', e);
        }
    }, []);

    useEffect(() => {
        try {
            const data: AppState = { ingredients, recipes, settings };
            SQLiteKVStore.setItemSync('bakery_cost_pro_v21_final', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }, [ingredients, recipes, settings]);

    const calculateRecipeCosts = (recipe: Partial<Recipe>) => {
        let totalCost = 0;
        recipe.ingredients?.forEach((ri) => {
            const ing = ingredients.find((i) => i.id === ri.ingredientId);
            if (ing) totalCost += ri.quantity * ing.pricePerUnit;
        });
        const costPerUnit = totalCost / (recipe.outputCount || 1);
        const sellingPrice = costPerUnit * (1 + (recipe.profitMargin || 0) / 100);
        return { costPerUnit, sellingPrice, totalCost };
    };

    return (
        <AppContext.Provider value={{
            ingredients,
            recipes,
            settings,
            setIngredients,
            setRecipes,
            setSettings,
            calculateRecipeCosts
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
