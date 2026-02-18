import { Unit } from "../db/schema";
import { UnitRepository } from "../repositories/UnitRepository";

export class UnitService {
    constructor(private unitRepo: UnitRepository) { }

    async getAllUnits(): Promise<Unit[]> {
        return await this.unitRepo.findAll();
    }

    async createUnit(name: string, symbol: string): Promise<Unit> {
        return await this.unitRepo.create({ name, symbol });
    }

    // Additional logic if needed
}

export const unitService = new UnitService(new UnitRepository());
