import type { AddedCost as AddedCost_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { AddedCostQueryDto } from "./addedcost.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { AddedCost } from "./addedcost.entity.js";
import { v7 as uuidv7 } from "uuid";

export class AddedCostRepository extends BaseRepository<AddedCost, AddedCostQueryDto> {

    public async findAll(query?: AddedCostQueryDto): Promise<PaginatedResult<AddedCost>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const where = query?.search ? {
            addedCostDescription: { contains: query.search },
        } : {};

        const [data, total] = await Promise.all([
            this.prisma.addedCost.findMany({
                skip,
                take: limit,
                where,
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? { [query.sortBy]: query.sortOrder }
                    : undefined,
            }),
            this.prisma.addedCost.count({ where }),
        ]);

        return {
            data: data.map((a) => this.toDomain(a)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<AddedCost | undefined> {
        const addedCost = await this.prisma.addedCost.findUnique({
            where: { id_addedCost: id },
        });

        return addedCost ? this.toDomain(addedCost) : undefined;
    }

    public async findByBudgetId(id_budget: string): Promise<AddedCost[]> {
        const addedCosts = await this.prisma.addedCost.findMany({
            where: { id_budget },
        });

        return addedCosts.map((a) => this.toDomain(a));
    }

    // Usado por BudgetService para recalcular estimatedTotal.
    public async sumByBudgetId(id_budget: string): Promise<number> {
        const result = await this.prisma.addedCost.aggregate({
            where: { id_budget },
            _sum: { addedCostAmount: true },
        });

        return result._sum.addedCostAmount?.toNumber() ?? 0;
    }

    public async create(item: AddedCost): Promise<AddedCost> {
        const addedCost = await this.prisma.addedCost.create({
            data: {
                id_addedCost: uuidv7(),
                id_budget: item.id_budget,
                type_addedCost: item.type_addedCost,
                addedCostDescription: item.addedCostDescription,
                addedCostAmount: item.addedCostAmount,
            },
        });

        return this.toDomain(addedCost);
    }

    public async update(id: string, item: Partial<AddedCost>): Promise<AddedCost | undefined> {
        const addedCost = await this.prisma.addedCost.update({
            where: { id_addedCost: id },
            data: {
                ...item,
            },
        });

        return this.toDomain(addedCost);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const addedCost = await this.prisma.addedCost.delete({
            where: { id_addedCost: id },
        });

        return { id: addedCost.id_addedCost };
    }

    private toDomain(addedCost: AddedCost_P): AddedCost {
        return new AddedCost(
            addedCost.id_budget,
            addedCost.type_addedCost,
            addedCost.addedCostDescription,
            addedCost.addedCostAmount.toNumber(),
            addedCost.id_addedCost,
        );
    }
}
