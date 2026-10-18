import type { PaginatedResult } from "@/shared/base.repository.js";
import type { EquipmentQueryDto } from "./equipment.schema.js";
import type { EquipmentRepository } from "./equipment.repository.js";
import { Equipment } from "./equipment.entity.js";

export class EquipmentService {
    constructor(private repo: EquipmentRepository) { }

    findAll(query?: EquipmentQueryDto): Promise<PaginatedResult<Equipment>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Equipment | undefined> {
        return this.repo.findById(id);
    }

    create(input: Omit<Equipment, "id">): Promise<Equipment | undefined> {
        return this.repo.create(input);
    }

    update(id: string, input: Partial<Equipment>): Promise<Equipment | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }

    findByClientId(clientId: string): Promise<Equipment[]> {
        return this.repo.findByClientId(clientId);
    }
}
