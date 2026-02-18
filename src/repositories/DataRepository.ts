import { db } from "../db/client";
import * as schema from "../db/schema";

export class DataRepository {
    async exportAll() {
        const [
            units,
            ingredients,
            recipes,
            recipeIngredients,
            priceHistory,
            settings
        ] = await Promise.all([
            db.select().from(schema.units),
            db.select().from(schema.ingredients),
            db.select().from(schema.recipes),
            db.select().from(schema.recipeIngredients),
            db.select().from(schema.priceHistory),
            db.select().from(schema.settings),
        ]);

        return {
            version: 1,
            exportedAt: new Date().toISOString(),
            data: {
                units,
                ingredients,
                recipes,
                recipeIngredients,
                priceHistory,
                settings
            }
        };
    }

    async importAll(payload: any) {
        const { data } = payload;

        // Helper to convert ISO strings back to Date objects for Drizzle
        const fixDates = (item: any) => {
            if (!item) return item;
            const result = { ...item };
            if (typeof result.createdAt === 'string') result.createdAt = new Date(result.createdAt);
            if (typeof result.updatedAt === 'string') result.updatedAt = new Date(result.updatedAt);
            if (typeof result.deletedAt === 'string') result.deletedAt = new Date(result.deletedAt);
            if (typeof result.date === 'string') result.date = new Date(result.date);
            return result;
        };

        await db.transaction(async (tx) => {
            // Clear existing data
            await tx.delete(schema.recipeIngredients);
            await tx.delete(schema.priceHistory);
            await tx.delete(schema.recipes);
            await tx.delete(schema.ingredients);
            await tx.delete(schema.units);
            await tx.delete(schema.settings);

            // Re-insert data with fixed dates
            if (data.units?.length > 0) {
                await tx.insert(schema.units).values(data.units.map(fixDates));
            }
            if (data.ingredients?.length > 0) {
                await tx.insert(schema.ingredients).values(data.ingredients.map(fixDates));
            }
            if (data.recipes?.length > 0) {
                await tx.insert(schema.recipes).values(data.recipes.map(fixDates));
            }
            if (data.recipeIngredients?.length > 0) {
                await tx.insert(schema.recipeIngredients).values(data.recipeIngredients.map(fixDates));
            }
            if (data.priceHistory?.length > 0) {
                await tx.insert(schema.priceHistory).values(data.priceHistory.map(fixDates));
            }
            if (data.settings?.length > 0) {
                await tx.insert(schema.settings).values(data.settings.map(fixDates));
            }
        });
    }

    async clearAll() {
        await db.transaction(async (tx) => {
            await tx.delete(schema.recipeIngredients);
            await tx.delete(schema.priceHistory);
            await tx.delete(schema.recipes);
            await tx.delete(schema.ingredients);
            await tx.delete(schema.settings);
            // We keep units or re-seed them after? 
            // The request says "delete data will delete everything".
            // Re-seeding units is safer for app stability.
            await tx.delete(schema.units);
        });
    }
}
