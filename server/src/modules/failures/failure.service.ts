import type { PaginatedResult } from "@/shared/base.repository.js";
import type { CreateFailuresDto, FailureQueryDto } from "./failure.schema.js";
import type { FailureRepository } from "./failure.repository.js";
import { Failure } from "./failure.entity.js";
import { BudgetService } from "../budgets/budget.service.js";

export class FailureService {
    constructor(private repo: FailureRepository, private budgetService: BudgetService) { }

    findAll(query?: FailureQueryDto): Promise<PaginatedResult<Failure>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Failure | undefined> {
        return this.repo.findById(id);
    }

    findByOrderId(id_order: string): Promise<Failure[]> {
        return this.repo.findByOrderId(id_order);
    }

    // Mapea "failureDescription" (nombre del campo en el DTO) a
    // "description" (nombre real del campo en el entity/modelo). Sin
    // status: dejamos que la DB aplique su @default(diagnosticada).
    createMany(items: CreateFailuresDto): Promise<Failure[]> {
        const failures = items.map((item) => new Failure(
            item.id_failure_type,
            item.id_order,
            item.failureDescription,
        ));

        return this.repo.createMany(failures);
    }

    update(id: string, input: Partial<Failure>): Promise<Failure | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
    async sumFailureCosts(id_order: string): Promise<number>{
        return this.budgetService.sumFailureCost(id_order);
    }
}