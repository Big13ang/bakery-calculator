import { and, eq, isNull } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import * as crypto from 'expo-crypto';
import { db } from "../db/client";

// Interface for entities that support soft delete & UUIDs
interface BaseEntity {
    id: string;
    deletedAt: Date | null;
}

export abstract class BaseRepository<T extends SQLiteTable> {
    constructor(protected table: T) { }

    // Helper to generate UUIDs
    protected generateId(): string {
        return crypto.randomUUID();
    }

    async create(data: any): Promise<any> { // using any for simplicity with Drizzle infer types, can be stricter
        const id = this.generateId();
        const now = new Date();
        const newItem = {
            ...data,
            id,
            createdAt: now,
            updatedAt: now,
        };
        // @ts-ignore
        await db.insert(this.table).values(newItem);
        return await this.findById(id);
    }

    async findAll(): Promise<any[]> {
        // @ts-ignore - Drizzle types can be tricky with generics, asserting base structure
        return await db.select().from(this.table).where(isNull(this.table.deletedAt));
    }

    async findById(id: string): Promise<any | undefined> {
        // @ts-ignore
        const result = await db.select().from(this.table).where(and(eq(this.table.id, id), isNull(this.table.deletedAt)));
        return result[0];
    }

    async update(id: string, data: any): Promise<any> {
        // @ts-ignore
        await db.update(this.table)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(this.table.id, id));
        return await this.findById(id);
    }

    async softDelete(id: string): Promise<void> {
        // @ts-ignore
        await db.update(this.table)
            .set({ deletedAt: new Date() })
            .where(eq(this.table.id, id));
    }

    // For specific queries ignoring soft delete (e.g. audit logs), add method if needed
}
