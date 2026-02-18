import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/client";
import { Ingredient, ingredients } from "../db/schema";
import { BaseRepository } from "./BaseRepository";

export class IngredientRepository extends BaseRepository<typeof ingredients> {
    constructor() {
        super(ingredients);
    }

    async findByUnitId(unitId: string): Promise<Ingredient[]> {
        return await db.select()
            .from(ingredients)
            .where(and(
                eq(ingredients.unitId, unitId),
                isNull(ingredients.deletedAt)
            ));
    }
}
