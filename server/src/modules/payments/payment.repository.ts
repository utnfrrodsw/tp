import type { Payment as Payment_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { PaymentQueryDto } from "./payment.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { Payment } from "./payment.entity.js";
import { v7 as uuidv7 } from "uuid";

export class PaymentRepository extends BaseRepository<Payment, PaymentQueryDto> {

    public async findAll(query?: PaymentQueryDto): Promise<PaginatedResult<Payment>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                skip,
                take: limit,
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? { [query.sortBy]: query.sortOrder }
                    : undefined,
            }),
            this.prisma.payment.count(),
        ]);

        return {
            data: data.map((p) => this.toDomain(p)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<Payment | undefined> {
        const payment = await this.prisma.payment.findUnique({
            where: { id_payment: id },
        });

        return payment ? this.toDomain(payment) : undefined;
    }

    public async findByBudgetId(id_budget: string): Promise<Payment[]> {
        const payments = await this.prisma.payment.findMany({
            where: { id_budget },
        });

        return payments.map((p) => this.toDomain(p));
    }

    public async sumByBudgetId(id_budget: string): Promise<number> {
        const result = await this.prisma.payment.aggregate({
            where: { id_budget },
            _sum: { amount: true },
        });

        return result._sum.amount?.toNumber() ?? 0;
    }

    public async create(item: Payment): Promise<Payment> {
        const payment = await this.prisma.payment.create({
            data: {
                id_payment: uuidv7(),
                id_payment_type: item.id_payment_type,
                id_budget: item.id_budget,
                amount: item.amount,
            },
        });

        return this.toDomain(payment);
    }

    public async update(id: string, item: Partial<Payment>): Promise<Payment | undefined> {
        const payment = await this.prisma.payment.update({
            where: { id_payment: id },
            data: {
                ...item,
            },
        });

        return this.toDomain(payment);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const payment = await this.prisma.payment.delete({
            where: { id_payment: id },
        });

        return { id: payment.id_payment };
    }

    private toDomain(payment: Payment_P): Payment {
        return new Payment(
            payment.id_payment_type,
            payment.id_budget,
            payment.amount.toNumber(),
            payment.id_payment,
            payment.dateOfPayment,
        );
    }
}
