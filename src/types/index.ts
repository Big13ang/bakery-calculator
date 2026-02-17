export type Unit = 'کیلوگرم' | 'گرم' | 'عدد' | 'بسته' | 'قرص' | 'لیتر' | 'میلی‌لیتر';

export interface Ingredient {
    id: string;
    name: string;
    unit: string; // Changed to string to be safe, or keep Unit if strict
    pricePerUnit: number;
    lastUpdated: number;
}

export interface RecipeIngredient {
    ingredientId: string;
    quantity: number;
}

export interface PriceHistoryRecord {
    timestamp: number;
    costPerUnit: number;
    sellingPrice: number;
    reason: string;
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: RecipeIngredient[];
    outputCount: number;
    outputUnit: string;
    profitMargin: number; // percentage
    currentCost: number;
    currentPrice: number;
    priceHistory: PriceHistoryRecord[];
}

export interface AppSettings {
    businessName: string;
    ownerName: string;
    subscriptionStatus: 'free' | 'test' | 'plus' | 'pro';
}

export interface AppState {
    ingredients: Ingredient[];
    recipes: Recipe[];
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
