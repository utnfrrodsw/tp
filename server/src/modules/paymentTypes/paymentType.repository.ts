import type { PaymentTypeQueryDto } from "./paymentType.schema.js"
import type { PaginatedResult } from "@/shared/base.repository.js"
import type { Payment_Type } from "@/generated/prisma/client.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { v7 as uuidv7 } from "uuid";
import { PaymentType } from "./paymentType.entity.js";

export class PaymentTypeRepository extends BaseRepository<PaymentType, PaymentTypeQueryDto> {

    public async findAll(query?: PaymentTypeQueryDto): Promise<PaginatedResult<PaymentType>> {

        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit
        );

        const [data, total] = await Promise.all([
            this.prisma.payment_Type.findMany({
                skip,
                take: limit,
                where: {
                    paymentTypeName: {
                        contains: query?.search,
                    },
                },
                orderBy: (query?.sortBy && query?.sortOrder) ? {
                    [query.sortBy]: query.sortOrder,
                } : undefined,
            }),
            
            this.prisma.payment_Type.count({
                where: {
                    paymentTypeName: {
                        contains: query?.search,
                    },
                },
            }),
        ]);

        return {
            data: data.map((paymentType) => this.toDomain(paymentType)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

    }

    public async findById(id: string): Promise<PaymentType | undefined> {
        const paymentType = await this.prisma.payment_Type.findUnique({
            where: {
                id_payment_type: id,
            },
        });

        return paymentType
            ? this.toDomain(paymentType)
            : undefined;
    }

    public async create(item: PaymentType): Promise<PaymentType> {
        const paymentType = await this.prisma.payment_Type.create({
            data: {
                id_payment_type: uuidv7(),
                ...item,
            },
        });

        return this.toDomain(paymentType);
    }

    public async update(id: string, item: Partial<PaymentType>): Promise<PaymentType | undefined> {
        const paymentType = await this.prisma.payment_Type.update({
            where: {
                id_payment_type: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(paymentType);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const paymentType = await this.prisma.payment_Type.delete({
            where: {
                id_payment_type: id,
            },
        });

        return {
            id: paymentType.id_payment_type,
        };
    }

    private toDomain(paymentType: Payment_Type): PaymentType {
        return new PaymentType(
            paymentType.paymentTypeName,
            paymentType.paymentMethod,
            paymentType.type_of_payment,
            paymentType.id_payment_type,
            paymentType.percentage.toNumber(),
        );
    }
}