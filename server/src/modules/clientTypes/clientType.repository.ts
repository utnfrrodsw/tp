import type { PaginatedResult } from "@/shared/base.repository.js";
import type { ClientTypeQueryDto } from "./clientType.schema.js";
import type { Client_Type } from "@/generated/prisma/client.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { ClientType } from "./clientType.entity.js";
import { v7 as uuidv7 } from "uuid";


export class ClientTypeRepository extends BaseRepository<ClientType, ClientTypeQueryDto> {

    public async findAll(query?: ClientTypeQueryDto): Promise<PaginatedResult<ClientType>> {

        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit
        );

        const [data, total] = await Promise.all([
            this.prisma.client_Type.findMany({
                skip,
                take: limit,
                where: {
                    clientTypeName: {
                        contains: query?.search,
                    }
                },
                orderBy: (query?.sortBy && query?.sortOrder) ? {
                    [query.sortBy]: query.sortOrder,
                } : undefined,
            }),

            this.prisma.client_Type.count({
                where: {
                    clientTypeName: {
                        contains: query?.search,
                    },
                },
            }),
        ]);

        return {
            data: data.map((clientType) => this.toDomain(clientType)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    public async findById(id: string): Promise<ClientType | undefined> {
        const clientType = await this.prisma.client_Type.findUnique({
            where: {
                id_client_type: id,
            },
        });

        return clientType
            ? this.toDomain(clientType)
            : undefined;
    }

    public async create(item: ClientType): Promise<ClientType> {
        const clientType = await this.prisma.client_Type.create({
            data: {
                id_client_type: uuidv7(),
                ...item,
            },
        });

        return this.toDomain(clientType);
    }

    public async update(id: string, item: Partial<ClientType>): Promise<ClientType | undefined> {
        const clientType = await this.prisma.client_Type.update({
            where: {
                id_client_type: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(clientType);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const clientType = await this.prisma.client_Type.delete({
            where: {
                id_client_type: id,
            },
        });

        return {
            id: clientType.id_client_type,
        };
    }

    private toDomain(clientType: Client_Type): ClientType {
        return new ClientType(
            clientType.clientTypeName,
            clientType.amountForCategoryUp,
            clientType.id_client_type,
        );
    }
}