import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { settings } from "../db/schema";
import { BaseRepository } from "./BaseRepository";

export class SettingsRepository extends BaseRepository<typeof settings> {
    constructor() {
        super(settings);
    }

    async getValue(key: string): Promise<string | null> {
        const result = await db.select()
            .from(settings)
            .where(eq(settings.key, key));
        return result[0]?.value ?? null;
    }

    async setValue(key: string, value: string): Promise<void> {
        const existing = await this.getValue(key);
        if (existing !== null) {
            await db.update(settings)
                .set({ value, updatedAt: new Date() })
                .where(eq(settings.key, key));
        } else {
            const id = this.generateId();
            await db.insert(settings).values({
                id,
                key,
                value
            });
        }
    }
}
