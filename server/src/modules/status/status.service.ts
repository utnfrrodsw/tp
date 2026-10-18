import type { $Enums } from "@/database/prisma.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { StatusQueryDto } from "./status.schema.js";
import type { StatusHistoryRepository } from "./status.repository.js";
import type { OrderRepository } from "@/modules/orders/order.repository.js";
import type { StatusHistory } from "./status.entity.js";
import type { PrismaClient, Prisma } from "@/generated/prisma/client.js";
import { BudgetRepository } from "../budgets/budget.repository.js";
import { Order } from "../orders/order.entity.js";
import { getBlockReason } from "./status.rules.js";

type Db = PrismaClient | Prisma.TransactionClient;

interface CreateStatusInput {
    id_order: string;
    id_user: string;
    status: $Enums.EnumOrderStatus;
    comment?: string;
}

export class StatusService {
    constructor(
        private repo: StatusHistoryRepository,
        private orderRepo: OrderRepository,
        private budgetRepo: BudgetRepository
    ) { }

    findAll(query?: StatusQueryDto): Promise<PaginatedResult<StatusHistory>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<StatusHistory | undefined> {
        return this.repo.findById(id);
    }

    findByOrderId(id_order: string): Promise<StatusHistory[]> {
        return this.repo.findByOrderId(id_order);
    }

    // Ya no hace falta leer el status actual de la orden para calcular
    // "previousStatus": cada fila es simplemente "la orden pasó a este
    // estado, en este momento, por este usuario". El orden cronológico de
    // las filas (dateOfChange) es lo que reconstruye la secuencia completa.
    async createStatus(input: CreateStatusInput): Promise<StatusHistory> {
        const order = await this.orderRepo.findById(input.id_order);
        if (!order) throw new Error("La orden no existe");

        const reason = getBlockReason(order, input.status);
        if (reason) throw new Error(reason);

        const entry = await this.repo.create({
            id_order: input.id_order,
            id_user: input.id_user,
            status: input.status,
            comment: input.comment,
        } as StatusHistory);


        await this.orderRepo.update(input.id_order, {
          status: input.status,
          deliveryDate: input.status === 'entregado' ? new Date() : undefined,
        });

        if (order.budget?.id_budget && input.status==='aprobado') {
        await this.budgetRepo.update(
            order.budget.id_budget,
            { status: 'aprobado' }
        );
        }

        return entry;
    }

    async createFirstStatus(
        id_order: string,
        id_user: string,
        status: $Enums.EnumOrderStatus,
        db?: Db,
    ): Promise<StatusHistory> {
        return this.repo.create(
            {
                id_order,
                id_user,
                status,
                comment: "Orden creada",
            } as StatusHistory,
            db,
        );
    };
    async findLastUserByStatus(id_order:string, status: $Enums.EnumOrderStatus): Promise<string | null >{
        const lastStatus = await this.repo.findLastByOrderIdAndStatus(id_order, status);
        return lastStatus?.id_user ?? null;
    };
}