import type { $Enums } from "@/database/prisma.js";
import type { Order, Equipment, Client, Failure, Failure_Type, AddedCost, Payment } from "@/generated/prisma/client.js";

export type FailureWithType = Failure & { failureType: Failure_Type };
export type OrderWithRelations = Order & {
    equipment: Equipment & { client: Client };
    failures: FailureWithType[];
};

export type OrderForBudgetCalculation = Pick<OrderWithRelations, 'failures'>;

export class Budget {
    constructor(
        public id_order: string,
        public laborCost: number,
        public id_budget?: string,
        public nroBudget?: number,
        public discount?: number,
        public status?: $Enums.EnumBudgetStatus,
        public budgetDate?: Date,
        public order?: OrderForBudgetCalculation, // ← antes era OrderWithRelations
        public addedCosts?: AddedCost[],
        public payments?: Payment[],
        public clientSuggestion?: string,
    ) { }

    get estimatedTotal(): number | undefined {
        if (!this.order?.failures || !this.addedCosts) return undefined;

        const failuresCost = this.order.failures.reduce(
            (sum, f) => sum + f.failureType.estimatedImport.toNumber(),
            0,
        );

        const addedCostsTotal = this.addedCosts.reduce(
            (sum, c) => sum + c.addedCostAmount.toNumber(),
            0,
        );

        const discount = this.discount ?? 0;

        return this.laborCost + failuresCost + addedCostsTotal - discount;
    }
    toJSON() {
        return {
            ...this,
            estimatedTotal: this.estimatedTotal,
        };
    }
}
