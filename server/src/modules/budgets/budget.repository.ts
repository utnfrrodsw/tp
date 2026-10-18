import type { Budget as Budget_P, AddedCost, Payment } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { BudgetQueryDto } from "./budget.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { Budget, type OrderWithRelations } from "./budget.entity.js";
import { v7 as uuidv7 } from "uuid";

const budgetInclude = {
    addedCosts: true,
    payments: true,
    order: { include: { failures: { include: { failureType: true } }, equipment: { include: { client: true } } } },
}

type BudgetWithIncludes = Budget_P & {
    order: OrderWithRelations;
    addedCosts: AddedCost[];
    payments: Payment[];
};

// Input flexible: a veces tenemos el Budget completo con todo (findById),
// a veces solo con order.failures parcial armado a mano desde OrderRepository.
// Lo único indispensable son los campos propios de Budget; order y addedCosts
// son opcionales porque no siempre están disponibles (ej: create/update sin include).
type BudgetMappingInput = Budget_P & {
    order?: Pick<OrderWithRelations, 'failures'> | OrderWithRelations;
    addedCosts?: AddedCost[];
    payments?: Payment[];
};

// Exportada como función standalone para que OrderRepository (y cualquier
// otro repository que anide un Budget) pueda armar la instancia de la misma
// forma, sin duplicar el mapeo.
export function toBudgetDomain(budget: BudgetMappingInput): Budget {
    return new Budget(
        budget.id_order,
        budget.laborCost.toNumber(),
        budget.id_budget,
        budget.nroBudget,
        budget.discount.toNumber(),
        budget.status,
        budget.budgetDate,
        budget.order,
        budget.addedCosts,
        budget.payments,
        budget.clientSuggestion ?? undefined
    );
}

export class BudgetRepository extends BaseRepository<Budget, BudgetQueryDto> {

    public async findAll(query?: BudgetQueryDto): Promise<PaginatedResult<Budget>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const [data, total] = await Promise.all([
            this.prisma.budget.findMany({
                skip,
                take: limit,
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? { [query.sortBy]: query.sortOrder }
                    : undefined,
                include: budgetInclude,
            }),

            this.prisma.budget.count(),
        ]);

        return {
            data: data.map((budget) => toBudgetDomain(budget as unknown as BudgetWithIncludes)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<Budget | undefined> {
        const budget = await this.prisma.budget.findUnique({
            where: { id_budget: id },
            include: budgetInclude
        });

        return budget ? toBudgetDomain(budget as unknown as BudgetWithIncludes) : undefined;
    }

    public async findByOrderId(id_order: string): Promise<Budget | undefined> {
        const budget = await this.prisma.budget.findUnique({
            where: { id_order },
        });

        return budget ? toBudgetDomain(budget) : undefined;
    }

    public async sumFailureCosts(id_order: string): Promise<number> {
        const failures = await this.prisma.failure.findMany({
            where: { id_order },
            select: {
                failureType: {
                    select: { estimatedImport: true },
                },
            },
        });

        return failures.reduce(
            (sum, f) => sum + f.failureType.estimatedImport.toNumber(),
            0,
        );
    }

    public async create(item: Budget): Promise<Budget> {
        const nroBudget = item.nroBudget ?? await this.getLastBudgetNumber();

        const budget = await this.prisma.budget.create({
            data: {
                id_budget: uuidv7(),
                nroBudget,
                id_order: item.id_order,
                laborCost: item.laborCost,
                discount: item.discount,
            },
        });

        return toBudgetDomain(budget);
    }

    public async update(id: string, item: Partial<Budget>): Promise<Budget | undefined> {
        const budget = await this.prisma.budget.update({
            where: { id_budget: id },
            data: {
                ...(item.laborCost !== undefined && { laborCost: item.laborCost }),
                ...(item.discount !== undefined && { discount: item.discount }),
                ...(item.status !== undefined && { status: item.status }),
                ...(item.nroBudget !== undefined && { nroBudget: item.nroBudget }),
                ...(item.budgetDate !== undefined && { budgetDate: item.budgetDate }),
                ...(item.clientSuggestion !== undefined && { clientSuggestion: item.clientSuggestion }),
    
            },
        });

        return toBudgetDomain(budget);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const budget = await this.prisma.budget.delete({
            where: { id_budget: id },
        });

        return { id: budget.id_budget };
    }

    private async getLastBudgetNumber() {
        const lastBudget = await this.prisma.budget.findFirst({
            orderBy: { nroBudget: "desc" },
            select: { nroBudget: true },
        });

        const nextNroBudget = lastBudget ? lastBudget.nroBudget + 1 : 1;
        return nextNroBudget;
    }
}