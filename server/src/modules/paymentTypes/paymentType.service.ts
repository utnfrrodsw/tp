import type { PaymentTypeQueryDto } from "./paymentType.schema.js"
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { BaseRepository } from "@/shared/base.repository.js";
import type { PaymentType } from "./paymentType.entity.js";

export class PaymentTypeService {
    constructor(private repo: BaseRepository<PaymentType>) { }

    findAll(query?: PaymentTypeQueryDto): Promise<PaginatedResult<PaymentType>> {
        return this.repo.findAll(query);
    }
    findById(id: string): Promise<PaymentType | undefined> {
        return this.repo.findById(id);
    }
    create(input: Omit<PaymentType, "id">): Promise<PaymentType | undefined> {
        return this.repo.create(input);
    }

    update(id: string, input: Partial<PaymentType>): Promise<PaymentType | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}
