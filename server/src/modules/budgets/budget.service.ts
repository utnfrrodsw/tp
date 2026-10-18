import { $Enums } from "@/database/prisma.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { BudgetQueryDto } from "./budget.schema.js";
import type { BudgetRepository } from "./budget.repository.js";
import type { AddedCostRepository } from "@/modules/addedCosts/addedcost.repository.js";
import type { StatusService } from "@/modules/status/status.service.js";
import type { Budget } from "./budget.entity.js";
import { string } from "zod";

interface CreateBudgetInput {
    id_order: string;
    laborCost: number;
    discount?: number;
    id_user: string;
}

export class BudgetService {
    constructor(
        private repo: BudgetRepository,
        // Solo el repository, no el AddedCostService: si dependiera del
        // service entero se armaría un ciclo (AddedCostService ya depende
        // de BudgetService para disparar el recálculo).
        private addedCostRepo: AddedCostRepository,
        private statusService: StatusService,
    ) { }

    findAll(query?: BudgetQueryDto): Promise<PaginatedResult<Budget>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Budget | undefined> {
        return this.repo.findById(id);
    }

    findByOrderId(id_order: string): Promise<Budget | undefined> {
        return this.repo.findByOrderId(id_order);
    }

    async create(input: CreateBudgetInput): Promise<Budget> {
        const discount = input.discount ?? 0;
        const failureCosts = await this.repo.sumFailureCosts(input.id_order);
        const estimatedTotal = input.laborCost + failureCosts - discount;

        const budget = await this.repo.create({
            id_order: input.id_order,
            laborCost: input.laborCost,
            discount,
            estimatedTotal,
        } as Budget);

        await this.statusService.createStatus({
            id_order: input.id_order,
            id_user: input.id_user,
            status: $Enums.EnumOrderStatus.presupuestado,
        });

        return budget;
    }

    async update(id: string, input: Partial<Budget>): Promise<Budget | undefined> {
        if (input.laborCost !== undefined || input.discount !== undefined) {
            return this.recalculateEstimatedTotal(id, input);
        }

        return this.repo.update(id, input);
    }

    async modifyBudget(id: string, input: Partial<Budget>): Promise<Budget | undefined> {
        const budget = await this.repo.findById(id);
        if (!budget) throw new Error('Presupuesto no encontrado');

        return this.update(id, {
            status: 'pendiente',
            ...input,
            
        });
    }


    async recalculateEstimatedTotal(id: string, overrides: Partial<Budget> = {}): Promise<Budget | undefined> {
        const current = await this.repo.findById(id);
        if (!current) return undefined;

        const laborCost = overrides.laborCost ?? current.laborCost;
        const discount = overrides.discount ?? current.discount ?? 0;

        const [failureCosts, addedCosts] = await Promise.all([
            this.repo.sumFailureCosts(current.id_order),
            this.addedCostRepo.sumByBudgetId(id),
        ]);

        const estimatedTotal = laborCost + failureCosts + addedCosts - discount;

        return this.repo.update(id, {
            ...overrides,
            laborCost,
            discount,
            estimatedTotal,
        });
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
    async sumFailureCost(id_order:string): Promise<number>{
        const result = this.repo.sumFailureCosts(id_order);
        return result;
    };
    async respondToBudget(id_budget: string, data: { status: $Enums.EnumBudgetStatus; client_suggestion?: string | null }): Promise<Budget | undefined> {
        const budget = await this.repo.findById(id_budget);
        if(!budget){
            throw new Error(`Presupuesto con id ${id_budget} no encontrado`);
        };
        if (budget.status !== 'pendiente') {
            throw new Error('El presupuesto ya fue respondido');
        };
        const result = await this.repo.update(id_budget, {
            status: data.status,
            clientSuggestion: String(data.client_suggestion) ?? null,
        });
        if(data.status === 'aprobado'){
            const idUser = await this.statusService.findLastUserByStatus(
                budget.id_order,
                'presupuestado'
            );
            if(!idUser){
                throw new Error('No se pudo encontrar el id del usuario que presupuesto');
            }
            await this.statusService.createStatus({
                id_order: budget.id_order,
                id_user: String(idUser),
                status: $Enums.EnumOrderStatus.aprobado,
            });
        }
        return result;
    }
}
