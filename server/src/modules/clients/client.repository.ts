import type { Client as Client_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { ClientQueryDto } from "./client.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { Client } from "./client.entity.js";
import { v7 as uuidv7 } from "uuid";

export class ClientRepository extends BaseRepository<Client, ClientQueryDto> {

    public async findAll(query?: ClientQueryDto): Promise<PaginatedResult<Client>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const where = {
            AND: [
                query?.search ? {
                    OR: [
                        { clientName: { contains: query.search } },
                        { clientEmail: { contains: query.search } },
                        { cuit: { contains: query.search } },
                    ],
                } : {},
                query?.id_client_type ? {
                    id_client_type: query.id_client_type,
                } : {},
                query?.dateFrom ? {
                    dateOfRegistration: { gte: new Date(query.dateFrom) },
                } : {},
                query?.dateTo ? {
                    dateOfRegistration: { lte: new Date(query.dateTo) },
                } : {},
            ],
        };

        const [data, total] = await Promise.all([
            this.prisma.client.findMany({
                skip,
                take: limit,
                where,
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? {
                        [query.sortBy]: query.sortOrder,
                    }
                    : undefined,
            }),

            this.prisma.client.count({ where }),
        ]);

        return {
            data: data.map((client) => this.toDomain(client)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<Client | undefined> {
        const client = await this.prisma.client.findUnique({
            where: {
                id_client: id,
            },
        });

        return client
            ? this.toDomain(client)
            : undefined;
    }

    // Reemplaza a getCategoryClientByOrders del viejo controller. Ordena
    // por umbral descendente para quedarnos con la categoría más alta que
    // el cliente ya alcanza, no con cualquiera que matchee `lte`.
    public async findDefaultCategoryForOrderCount(orderCount: number): Promise<{ id_client_type: string } | undefined> {
        const category = await this.prisma.client_Type.findFirst({
            where: {
                amountForCategoryUp: {
                    lte: orderCount,
                },
            },
            orderBy: {
                amountForCategoryUp: 'desc',
            },
            select: {
                id_client_type: true,
            },
        });

        return category ?? undefined;
    }

    public async create(item: Client): Promise<Client> {
        const client = await this.prisma.client.create({
            data: {
                id_client: uuidv7(),
                clientName: item.clientName,
                clientEmail: item.clientEmail,
                clientPhone: item.clientPhone,
                cuit: item.cuit,
                id_client_type: item.id_client_type as string,
                dateOfRegistration: item.dateOfRegistration,
                status: item.status,
            },
        });

        return this.toDomain(client);
    }

    public async update(id: string, item: Partial<Client>): Promise<Client | undefined> {
        const client = await this.prisma.client.update({
            where: {
                id_client: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(client);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const client = await this.prisma.client.delete({
            where: {
                id_client: id,
            },
        });

        return {
            id: client.id_client,
        };
    }

    private toDomain(client: Client_P): Client {
        return new Client(
            client.clientName,
            client.clientEmail,
            client.clientPhone,
            client.cuit,
            client.id_client_type,
            client.id_client,
            client.dateOfRegistration,
            client.status,
        );
    }
}