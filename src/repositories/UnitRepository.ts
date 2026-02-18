import { units } from "../db/schema";
import { BaseRepository } from "./BaseRepository";

export class UnitRepository extends BaseRepository<typeof units> {
    constructor() {
        super(units);
    }
}
