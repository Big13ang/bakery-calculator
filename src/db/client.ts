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
    const DEFAULT_UNITS = [
        { name: 'گرم', symbol: 'g' },
        { name: 'کیلوگرم', symbol: 'kg' },
        { name: 'میلی‌گرم', symbol: 'mg' },
        { name: 'مثقال', symbol: 'مثقال' },
        { name: 'لیتر', symbol: 'l' },
        { name: 'میلی‌لیتر', symbol: 'ml' },
        { name: 'سی‌سی', symbol: 'cc' },
        { name: 'پیمانه', symbol: 'cup' },
        { name: 'قاشق غذاخوری', symbol: 'tbsp' },
        { name: 'قاشق چای‌خوری', symbol: 'tsp' },
        { name: 'عدد', symbol: 'pcs' },
        { name: 'بسته', symbol: 'pkg' },
        { name: 'جعبه', symbol: 'box' },
        { name: 'کارتن', symbol: 'ctn' },
        { name: 'سینی', symbol: 'tray' },
        { name: 'ورق', symbol: 'sheet' },
    ];

    console.log("Checking for missing units...");
    const existing = await db.select().from(schema.units);
    const existingNames = new Set(existing.map(u => u.name));

    const toInsert = DEFAULT_UNITS.filter(u => !existingNames.has(u.name));

    if (toInsert.length > 0) {
        console.log(`Seeding ${toInsert.length} new units...`);
        await db.insert(schema.units).values(
            toInsert.map(u => ({
                id: crypto.randomUUID(),
                name: u.name,
                symbol: u.symbol,
            }))
        );
        console.log("Units seeded.");
    } else {
        console.log("All default units already exist.");
    }
};
