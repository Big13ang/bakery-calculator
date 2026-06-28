import { RecipeIngredient } from '../../types';

export interface FormState {
    name: string;
    outputCount: string;
    outputUnitId: string;
    profitMargin: string;
    overheadCost: string;
    selectedIngredients: RecipeIngredient[];
    currentIngId: string;
    currentQty: string;
}

export type FormAction =
    | { type: 'UPDATE_FIELD'; key: keyof FormState; value: any }
    | { type: 'ADD_INGREDIENT'; ingredientId: string; quantity: number }
    | { type: 'REMOVE_INGREDIENT'; index: number };
