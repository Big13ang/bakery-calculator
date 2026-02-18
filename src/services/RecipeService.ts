import { eq } from "drizzle-orm";
import * as crypto from 'expo-crypto';
import { db } from "../db/client";
import { NewRecipe, Recipe, priceHistory } from "../db/schema";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { RecipeRepository } from "../repositories/RecipeRepository";
import { RecipeWithIngredients } from "../types";

export class RecipeService {
    constructor(
        private recipeRepo: RecipeRepository,
        private ingredientRepo: IngredientRepository
    ) { }

    async getAllRecipes(): Promise<RecipeWithIngredients[]> {
        const recipes = await this.recipeRepo.findAll();
        const results: RecipeWithIngredients[] = [];

        for (const recipe of recipes) {
            const ingredients = await this.recipeRepo.getIngredients(recipe.id);
            // Fetch price history
            const history = await db.select().from(priceHistory).where(eq(priceHistory.entityId, recipe.id));

            // Calculate derived metrics
            const totalCost = ingredients.reduce((sum, ri) => sum + (ri.ingredientPrice || 0) * ri.quantity, 0);
            const totalPrice = totalCost * (1 + (recipe.profitMargin || 0) / 100);
            const profit = totalPrice - totalCost;

            results.push({
                ...recipe,
                ingredients,
                priceHistory: history,
                totalCost,
                totalPrice,
                profit
            });
        }
        return results;
    }

    async createRecipe(data: NewRecipe & { ingredients?: { ingredientId: string, quantity: number }[] }): Promise<RecipeWithIngredients> {
        // Create base recipe
        const recipe = await this.recipeRepo.create(data);

        // Add ingredients if provided
        if (data.ingredients && data.ingredients.length > 0) {
            for (const ing of data.ingredients) {
                await this.recipeRepo.addIngredient(recipe.id, ing.ingredientId, ing.quantity);
            }
        }

        // Recalculate cost immediately
        await this.recalculateCosts(recipe.id);

        const ingredients = await this.recipeRepo.getIngredients(recipe.id);
        return { ...recipe, ingredients };
    }

    async addIngredientToRecipe(recipeId: string, ingredientId: string, quantity: number) {
        await this.recipeRepo.addIngredient(recipeId, ingredientId, quantity);
        await this.recalculateCosts(recipeId, 'Ingredient Added');
    }

    async updateCostsForIngredient(ingredientId: string, reason: string) {
        const recipes = await this.recipeRepo.getRecipesByIngredientId(ingredientId);
        for (const r of recipes) {
            await this.recalculateCosts(r.recipeId, reason);
        }
    }

    async recalculateCosts(recipeId: string, reason: string = 'Cost Recalculation'): Promise<Recipe> {
        const recipe = await this.recipeRepo.findById(recipeId);
        if (!recipe) throw new Error("Recipe not found");

        const recipeIngredients = await this.recipeRepo.getIngredients(recipeId);
        let totalCost = 0;

        for (const ri of recipeIngredients) {
            const ingredient = await this.ingredientRepo.findById(ri.ingredientId);
            if (ingredient) {
                totalCost += ingredient.price * ri.quantity;
            }
        }

        // Calculate Cost Per Unit (Output)
        const costPerUnit = totalCost / (recipe.outputCount || 1);

        // Formula 4: Calculation of Total Selling Price
        const profitMultiplier = 1 + (recipe.profitMargin / 100);
        const totalSellingPrice = totalCost * profitMultiplier;

        // Formula 3: Selling Price per Unit
        const sellingPricePerUnit = costPerUnit * profitMultiplier;

        // Formula 5: Net Profit
        const netProfit = totalSellingPrice - totalCost;

        // Log price change if significant
        if (recipe.currentPrice !== sellingPricePerUnit) {
            await db.insert(priceHistory).values({
                id: crypto.randomUUID(),
                entityType: 'recipe',
                entityId: recipeId,
                oldPrice: recipe.currentPrice || 0,
                newPrice: sellingPricePerUnit,
                cost: costPerUnit,
                reason: reason
            });
        }

        // Update Recipe with new values
        return await this.recipeRepo.update(recipeId, {
            currentCost: costPerUnit,
            currentPrice: sellingPricePerUnit
            // Note: We don't store totalSellingPrice and netProfit in the DB to keep it normalized,
            // but we could if performance was an issue. For now, we'll calculate them on the fly in getAllRecipes.
        });
    }

    async updateRecipe(id: string, updates: Partial<Recipe>, newIngredients?: { ingredientId: string, quantity: number }[]): Promise<RecipeWithIngredients> {
        // Update metadata
        await this.recipeRepo.update(id, updates);

        // Update ingredients if provided
        if (newIngredients) {
            await this.recipeRepo.clearIngredients(id);
            for (const ing of newIngredients) {
                await this.recipeRepo.addIngredient(id, ing.ingredientId, ing.quantity);
            }
            await this.recalculateCosts(id);
        }

        const updated = await this.recipeRepo.findById(id);
        if (!updated) throw new Error("Recipe not found after update");

        const ingredients = await this.recipeRepo.getIngredients(id);
        return { ...updated, ingredients };
    }

    async deleteRecipe(id: string): Promise<void> {
        return await this.recipeRepo.softDelete(id);
    }
}

export const recipeService = new RecipeService(new RecipeRepository(), new IngredientRepository());
