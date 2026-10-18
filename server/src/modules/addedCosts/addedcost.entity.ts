import type { $Enums } from "@/database/prisma.js"

export class AddedCost {
    constructor(
        public id_budget: string,
        public type_addedCost: $Enums.EnumTypeAddedCost,
        public addedCostDescription: string,
        public addedCostAmount: number,
        public id_addedCost?: string,
    ) { }
}
