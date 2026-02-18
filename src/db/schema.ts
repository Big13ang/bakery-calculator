import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Helper for standardized columns
const baseSchema = {
    id: text('id').primaryKey(), // UUID logic handled in repositories
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft delete support
};

export const units = sqliteTable('units', {
    ...baseSchema,
    name: text('name').notNull(), // e.g., "Kilogram"
    symbol: text('symbol').notNull(), // e.g., "kg"
});

export const ingredients = sqliteTable('ingredients', {
    ...baseSchema,
    name: text('name').notNull(),
    unitId: text('unit_id').references(() => units.id).notNull(),
    price: real('price').notNull(), // Cost per unit
});

export const recipes = sqliteTable('recipes', {
    ...baseSchema,
    name: text('name').notNull(),
    outputCount: real('output_count').notNull().default(1),
    outputUnitId: text('output_unit_id').references(() => units.id).notNull(),
    profitMargin: real('profit_margin').notNull().default(0), // as percentage (e.g., 20 for 20%)
    currentCost: real('current_cost'), // Cached calculated cost
    currentPrice: real('current_price'), // Cached calculated price
});

export const recipeIngredients = sqliteTable('recipe_ingredients', {
    ...baseSchema,
    recipeId: text('recipe_id').references(() => recipes.id).notNull(),
    ingredientId: text('ingredient_id').references(() => ingredients.id).notNull(),
    quantity: real('quantity').notNull(),
});

export const priceHistory = sqliteTable('price_history', {
    ...baseSchema,
    entityType: text('entity_type', { enum: ['ingredient', 'recipe'] }).notNull(),
    entityId: text('entity_id').notNull(),
    oldPrice: real('old_price'),
    newPrice: real('new_price').notNull(),
    cost: real('cost'), // Cost at the time of record (for recipes)
    reason: text('reason'),
});

export const settings = sqliteTable('settings', {
    ...baseSchema,
    key: text('key').notNull().unique(),
    value: text('value').notNull(), // JSON string or simple value
});

// Type definitions
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type NewRecipeIngredient = typeof recipeIngredients.$inferInsert;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;