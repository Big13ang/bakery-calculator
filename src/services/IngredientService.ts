import * as crypto from 'expo-crypto';
import { db } from "../db/client"; // Direct DB access for history insert if no repo, or use generic repo
import { Ingredient, NewIngredient, priceHistory } from "../db/schema";
import { IngredientRepository } from "../repositories/IngredientRepository";

export class IngredientService {
    constructor(private ingredientRepo: IngredientRepository) { }

    async getAllIngredients(): Promise<Ingredient[]> {
        return await this.ingredientRepo.findAll();
    }

    async createIngredient(data: NewIngredient): Promise<Ingredient> {
        return await this.ingredientRepo.create(data);
    }

    async updatePrice(id: string, newPrice: number, reason: string = "Manual Update"): Promise<Ingredient> {
        return await this.updateIngredient(id, { price: newPrice }, reason);
    }

    async updateIngredient(id: string, updates: Partial<Ingredient>, reason: string = "Manual Update"): Promise<Ingredient> {
        const ingredient = await this.ingredientRepo.findById(id);
        if (!ingredient) throw new Error("Ingredient not found");

        const hasPriceChanged = updates.price !== undefined && updates.price !== ingredient.price;

        if (hasPriceChanged) {
            // Log history
            await db.insert(priceHistory).values({
                id: crypto.randomUUID(),
                entityType: 'ingredient',
                entityId: id,
                oldPrice: ingredient.price,
                newPrice: updates.price as number,
                reason: reason
            });
        }

        // Update ingredient
        return await this.ingredientRepo.update(id, updates);
    }

    async deleteIngredient(id: string): Promise<void> {
        return await this.ingredientRepo.softDelete(id);
    }
}

export const ingredientService = new IngredientService(new IngredientRepository());
