import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import { openDatabaseSync } from "expo-sqlite";
import migrations from "../drizzle/migrations";
import * as schema from "./schema";

const dbName = "peymaneh.db";

export const migrateDatabaseFile = async () => {
    const oldDbNames = ["bakery_app.db", "amoo-ghanad-v1"];
    const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
    const newDbUri = `${sqliteDir}${dbName}`;

    try {
        // Check if new database already exists
        const newDbInfo = await FileSystem.getInfoAsync(newDbUri);
        if (newDbInfo.exists) {
            console.log("New database 'peymaneh.db' already exists, skipping file-level migration.");
            return;
        }

        // Ensure SQLite directory exists
        const sqliteDirInfo = await FileSystem.getInfoAsync(sqliteDir);
        if (!sqliteDirInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
        }

        // Attempt to copy from old database names
        for (const oldDbName of oldDbNames) {
            const oldDbUri = `${sqliteDir}${oldDbName}`;
            const oldDbInfo = await FileSystem.getInfoAsync(oldDbUri);
            if (oldDbInfo.exists) {
                console.log(`Migrating database file from ${oldDbName} to ${dbName}...`);
                await FileSystem.copyAsync({
                    from: oldDbUri,
                    to: newDbUri
                });
                console.log(`Successfully migrated database file to ${dbName}`);
                return;
            }
        }
        console.log("No legacy database file found to migrate.");
    } catch (error) {
        console.error("Error during database file migration:", error);
    }
};

let expoSqliteInstance: any = null;
let dbInstance: any = null;

export const getExpoSqlite = () => {
    if (!expoSqliteInstance) {
        expoSqliteInstance = openDatabaseSync(dbName);
    }
    return expoSqliteInstance;
};

const getDb = () => {
    if (!dbInstance) {
        dbInstance = drizzle(getExpoSqlite(), { schema });
    }
    return dbInstance;
};

export const db = new Proxy({} as any, {
    get(target, prop, receiver) {
        return Reflect.get(getDb(), prop, receiver);
    }
});

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
