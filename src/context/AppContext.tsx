import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { StatusModal } from '../components/ui/StatusModal';
import { ingredientService } from '../services/IngredientService';
import { recipeService } from '../services/RecipeService';
import { settingsService } from '../services/SettingsService';
import { unitService } from '../services/UnitService';
import { AppSettings, Ingredient, NewIngredient, NewRecipe, Recipe, RecipeWithIngredients, Unit } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
    businessName: '',
    ownerName: '',
    subscriptionStatus: 'free',
    hasAcceptedTerms: false,
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
    updateSetting: (key: string, value: string | boolean) => Promise<void>;

    // Data Management Actions
    exportData: () => Promise<void>;
    importData: () => Promise<void>;
    resetAllData: () => Promise<void>;
    showStatus: (type: 'success' | 'error', title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [statusModal, setStatusModal] = useState<{ visible: boolean, type: 'success' | 'error', title: string, message: string }>({
        visible: false,
        type: 'success',
        title: '',
        message: ''
    });

    const showStatus = useCallback((type: 'success' | 'error', title: string, message: string) => {
        setStatusModal({ visible: true, type, title, message });
    }, []);

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

    const addIngredient = useCallback(async (data: NewIngredient) => {
        await ingredientService.createIngredient(data);
        await refreshData();
    }, [refreshData]);

    const updateIngredientPrice = useCallback(async (id: string, newPrice: number) => {
        await ingredientService.updatePrice(id, newPrice);
        // Recalculate costs for all recipes using this ingredient
        await recipeService.updateCostsForIngredient(id, 'تغییر قیمت ماده اولیه');
        await refreshData();
    }, [refreshData]);

    const updateIngredient = useCallback(async (id: string, data: Partial<Ingredient>) => {
        await ingredientService.updateIngredient(id, data);
        if (data.price !== undefined) {
            await recipeService.updateCostsForIngredient(id, 'بروزرسانی اطلاعات ماده اولیه');
        }
        await refreshData();
    }, [refreshData]);

    const deleteIngredient = useCallback(async (id: string) => {
        await ingredientService.deleteIngredient(id);
        await refreshData();
    }, [refreshData]);

    // --- Recipe Actions ---

    const addRecipe = useCallback(async (data: NewRecipe & { ingredients?: { ingredientId: string, quantity: number }[] }): Promise<string> => {
        const newRecipe = await recipeService.createRecipe(data);
        await refreshData();
        return newRecipe.id;
    }, [refreshData]);

    const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>, newIngredients?: { ingredientId: string, quantity: number }[]) => {
        await recipeService.updateRecipe(id, updates, newIngredients);
        await refreshData();
    }, [refreshData]);

    const addIngredientToRecipe = useCallback(async (recipeId: string, ingredientId: string, quantity: number) => {
        await recipeService.addIngredientToRecipe(recipeId, ingredientId, quantity);
        await refreshData();
    }, [refreshData]);

    const recalculateRecipe = useCallback(async (recipeId: string) => {
        await recipeService.recalculateCosts(recipeId);
        await refreshData();
    }, [refreshData]);

    const deleteRecipe = useCallback(async (id: string) => {
        await recipeService.deleteRecipe(id);
        await refreshData();
    }, [refreshData]);

    // --- Settings Actions ---

    const updateSetting = useCallback(async (key: string, value: string | boolean) => {
        const stringValue = String(value);
        // Optimistically update state immediately so the UI responds without waiting for the DB
        setSettings(prev => ({ ...prev, [key]: value } as AppSettings));
        await settingsService.setSetting(key, stringValue);
    }, []);

    // --- Data Management Actions ---

    const exportData = useCallback(async () => {
        const { dataService } = await import('../services/DataService');
        try {
            await dataService.exportData();
            showStatus('success', 'خروجی موفق', 'اطلاعات با موفقیت ذخیره و آماده اشتراک‌گذاری شد.');
        } catch (error: any) {
            console.error("Export error:", error);
            showStatus('error', 'خطا در خروجی', error.message || 'مشکلی در تهیه فایل پشتیبان پیش آمد.');
        }
    }, [showStatus]);

    const importData = useCallback(async () => {
        const { dataService } = await import('../services/DataService');
        try {
            const success = await dataService.importData();
            if (success) {
                await refreshData();
                showStatus('success', 'بازیابی موفق', 'تمام اطلاعات با موفقیت از فایل پشتیبان جایگزین شد.');
            }
        } catch (error: any) {
            console.error("Import error:", error);
            showStatus('error', 'خطا در بازیابی', error.message || 'فایل انتخاب شده معتبر نیست یا فرآیند با خطا مواجه شد.');
        }
    }, [refreshData, showStatus]);

    const resetAllData = useCallback(async () => {
        const { dataService } = await import('../services/DataService');
        try {
            const success = await dataService.resetAllData();
            if (success) {
                // Re-run migrations to ensure units are seeded
                const { runMigrations } = await import('../db/client');
                await runMigrations();
                await refreshData();
                showStatus('success', 'پاکسازی موفق', 'تمام اطلاعات با موفقیت حذف شد.');
            }
        } catch (error: any) {
            console.error("Reset error:", error);
            showStatus('error', 'خطا در پاکسازی', error.message || 'مشکلی در حذف اطلاعات پیش آمد.');
        }
    }, [refreshData, showStatus]);

    // Helper for UI drafts
    const calculateDraftCosts = useCallback((recipe: Partial<Recipe> & { ingredients?: { ingredientId: string, quantity: number }[] }) => {
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
    }, [ingredients]);

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
            updateSetting,
            exportData,
            importData,
            resetAllData,
            showStatus
        }}>
            {children}
            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, visible: false }))}
            />
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
