import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/client";
import { ingredients, recipeIngredients, recipes } from "../db/schema";
import { BaseRepository } from "./BaseRepository";

export class RecipeRepository extends BaseRepository<typeof recipes> {
    constructor() {
        super(recipes);
    }

    // Override generic create to handle complex recipe creation if needed, 
    // or just add helper for ingredients
    async addIngredient(recipeId: string, ingredientId: string, quantity: number) {
        const id = this.generateId();
        await db.insert(recipeIngredients).values({
            id,
            recipeId,
            ingredientId,
            quantity
        });
    }

    async getIngredients(recipeId: string) {
        return await db.select({
            id: recipeIngredients.id,
            recipeId: recipeIngredients.recipeId,
            ingredientId: recipeIngredients.ingredientId,
            quantity: recipeIngredients.quantity,
            ingredientName: ingredients.name,
            ingredientPrice: ingredients.price,
            unitId: ingredients.unitId
        })
            .from(recipeIngredients)
            .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
            .where(and(
                eq(recipeIngredients.recipeId, recipeId),
                isNull(recipeIngredients.deletedAt)
            ));
    }

    async clearIngredients(recipeId: string) {
        // Hard delete from junction or soft? Probably soft if we want full history, 
        // but often junction table soft deletes are overkill. 
        // Let's stick to update deletedAt for consistency.
        await db.update(recipeIngredients)
            .set({ deletedAt: new Date() })
            .where(eq(recipeIngredients.recipeId, recipeId));
    }

    async getRecipesByIngredientId(ingredientId: string) {
        return await db.select({ recipeId: recipeIngredients.recipeId })
            .from(recipeIngredients)
            .where(and(
                eq(recipeIngredients.ingredientId, ingredientId),
                isNull(recipeIngredients.deletedAt)
            ));
    }
}
