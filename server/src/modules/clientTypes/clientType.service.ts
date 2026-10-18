import type { BaseRepository, PaginatedResult } from "@/shared/base.repository.js";
import type { ClientTypeQueryDto } from "./clientType.schema.js"
import type { ClientType } from "./clientType.entity.js";

export interface ClientTypeResponseDto {
    id: string;
    name: string;
}

export class ClientTypeService {
    constructor(private repo: BaseRepository<ClientType>) { }

    findAll(query?: ClientTypeQueryDto): Promise<PaginatedResult<ClientType>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<ClientType | undefined> {
        return this.repo.findById(id);
    }
    
    create(input: Omit<ClientType, "id">): Promise<ClientType | undefined> {
        return this.repo.create(input);
    }

    update(id: string, input: Partial<ClientType>): Promise<ClientType | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}
