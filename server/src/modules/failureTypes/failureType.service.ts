import type { FailureTypeRepository } from "./failureType.repository.js"
import type { FailureTypeQueryDto } from "./failureType.schema.js"
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { FailureType } from "./failureType.entity.js";


export class FailureTypeService {
    constructor(private repo: FailureTypeRepository) { }

    findAll(query?: FailureTypeQueryDto): Promise<PaginatedResult<FailureType>> {
        return this.repo.findAll(query);
    }
    findById(id: string): Promise<FailureType | undefined> {
        return this.repo.findById(id);
    }
    create(input: Omit<FailureType, "id">): Promise<FailureType | undefined> {
        return this.repo.create(input);
    }

    update(id: string, input: Partial<FailureType>): Promise<FailureType | undefined> {
        return this.repo.update(id, input);
    }

    async delete(id: string): Promise<{ id: string } | undefined> {
        const failuresUsingType = await this.repo.countFailuresByType(id);

        if (failuresUsingType > 0) {
            throw Error(`No se puede eliminar: hay ${failuresUsingType} falla(s) registrada(s) con este tipo.`);
        }

        return this.repo.delete(id);
    }
}
