import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as crypto from 'expo-crypto';
import { openDatabaseSync } from "expo-sqlite";
import migrations from "../drizzle/migrations";
import * as schema from "./schema";

const dbName = "bakery_app.db";
export const expoSqlite = openDatabaseSync(dbName);

export const db = drizzle(expoSqlite, { schema });

export const runMigrations = async () => {
    console.log("Running migrations...");
    try {
        console.log("Migrations object keys:", Object.keys(migrations));
        if (migrations.journal) {
            console.log("Journal entries:", migrations.journal.entries?.length);
        } else {
            console.error("Journal is missing in migrations object!");
        }
        await migrate(db, migrations);
        console.log("Migrations completed.");
        await seedUnits();
    } catch (e) {
        console.error("Migration/Seed failed:", e);
        throw e;
    }
};

const seedUnits = async () => {
    const existing = await db.select().from(schema.units).limit(1);
    if (existing.length === 0) {
        console.log("Seeding units...");
        await db.insert(schema.units).values([
            { id: crypto.randomUUID(), name: 'گرم', symbol: 'g' },
            { id: crypto.randomUUID(), name: 'کیلوگرم', symbol: 'kg' },
            { id: crypto.randomUUID(), name: 'عدد', symbol: 'pcs' },
            { id: crypto.randomUUID(), name: 'قاشق چای‌خوری', symbol: 'tsp' },
            { id: crypto.randomUUID(), name: 'قاشق غذاخوری', symbol: 'tbsp' },
            { id: crypto.randomUUID(), name: 'لیوان', symbol: 'cup' },
        ]);
        console.log("Units seeded.");
    }
};
