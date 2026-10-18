import type { PaginatedResult } from "@/shared/base.repository.js";
import type { AddedCostQueryDto } from "./addedcost.schema.js";
import type { AddedCostRepository } from "./addedcost.repository.js";
import type { BudgetService } from "@/modules/budgets/budget.service.js";
import { AddedCost } from "./addedcost.entity.js";

export class AddedCostService {
    constructor(
        private repo: AddedCostRepository,
        private budgetService: BudgetService,
    ) { }

    findAll(query?: AddedCostQueryDto): Promise<PaginatedResult<AddedCost>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<AddedCost | undefined> {
        return this.repo.findById(id);
    }

    findByBudgetId(id_budget: string): Promise<AddedCost[]> {
        return this.repo.findByBudgetId(id_budget);
    }

    async create(input: Omit<AddedCost, "id_addedCost">): Promise<AddedCost> {
        const addedCost = await this.repo.create(input as AddedCost);
        await this.budgetService.recalculateEstimatedTotal(input.id_budget);
        await this.budgetService.modifyBudget(input.id_budget,{});
        return addedCost;
    }

    async update(id: string, input: Partial<AddedCost>): Promise<AddedCost | undefined> {
        const updated = await this.repo.update(id, input);

        if (updated) {
            await this.budgetService.recalculateEstimatedTotal(updated.id_budget);
        }

        return updated;
    }

    async delete(id: string): Promise<{ id: string } | undefined> {
        const existing = await this.repo.findById(id);
        const deleted = await this.repo.delete(id);

        if (deleted && existing) {
            await this.budgetService.recalculateEstimatedTotal(existing.id_budget);
        }

        return deleted;
    }
    async sumByBudgetId(id_budget:string): Promise<number>{
        const existing = await this.budgetService.findById(id_budget);
        let result = 0.00
        if (existing){
            result = await this.repo.sumByBudgetId(id_budget);
        };
        return result;
    }
}
