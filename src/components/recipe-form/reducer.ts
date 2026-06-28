import { FormAction, FormState } from './types';

export const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.key]: action.value,
            };
        case 'ADD_INGREDIENT': {
            const nextIngredients = [...state.selectedIngredients];
            const existingIdx = nextIngredients.findIndex(item => item.ingredientId === action.ingredientId);

            if (existingIdx > -1) {
                const prevQty = Number(nextIngredients[existingIdx].quantity) || 0;
                nextIngredients[existingIdx] = {
                    ...nextIngredients[existingIdx],
                    quantity: prevQty + action.quantity,
                };
            } else {
                nextIngredients.push({ ingredientId: action.ingredientId, quantity: action.quantity } as any);
            }

            return {
                ...state,
                selectedIngredients: nextIngredients,
                currentIngId: '',
                currentQty: '',
            };
        }
        case 'REMOVE_INGREDIENT':
            return {
                ...state,
                selectedIngredients: state.selectedIngredients.filter((_, i) => i !== action.index),
            };
        default:
            return state;
    }
};
