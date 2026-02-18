export * from '../db/schema';
import { Ingredient, PriceHistory, Recipe, RecipeIngredient } from '../db/schema';

// Extended type for UI usage that includes the relation
export interface RecipeWithIngredients extends Recipe {
    ingredients: RecipeIngredient[];
    priceHistory: PriceHistory[];
    totalCost?: number;
    totalPrice?: number;
    profit?: number;
}

export interface AppSettings {
    businessName: string;
    ownerName: string;
    subscriptionStatus: 'free' | 'test' | 'plus' | 'pro';
}

export interface AppState {
    ingredients: Ingredient[];
    recipes: RecipeWithIngredients[];
    settings?: AppSettings;
}

export interface ThemeConfig {
    id: string;
    name: string;
    bg: string;
    card: string;
    text: string;
    accent: string;
    secondary: string;
    border: string;
    radius: string;
    shadow: string;
    font: string;
    danger: string;
}
