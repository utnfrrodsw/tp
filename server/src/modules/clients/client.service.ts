import type { PaginatedResult } from "@/shared/base.repository.js";
import type { ClientQueryDto } from "./client.schema.js";
import type { ClientRepository } from "./client.repository.js";
import type { Client } from "./client.entity.js";

export class ClientService {
    constructor(private repo: ClientRepository) { }

    findAll(query?: ClientQueryDto): Promise<PaginatedResult<Client>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Client | undefined> {
        return this.repo.findById(id);
    }
    async create(input: Omit<Client, "id_client">): Promise<Client | undefined> {
        const category = await this.repo.findDefaultCategoryForOrderCount(0);

        if (!category) {
            throw new Error("No hay una categoría de cliente configurada para asignar");
        }

        return this.repo.create({
            ...input,
            id_client_type: category.id_client_type,
        } as Client);
    }

    update(id: string, input: Partial<Client>): Promise<Client | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}