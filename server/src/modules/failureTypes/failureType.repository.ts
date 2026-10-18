import type { FailureTypeQueryDto } from "./failureType.schema.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { Failure_Type } from "@/generated/prisma/client.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { FailureType } from "./failureType.entity.js";
import { v7 as uuidv7 } from "uuid";

export class FailureTypeRepository extends BaseRepository<FailureType, FailureTypeQueryDto> {

    public async findAll(query?: FailureTypeQueryDto): Promise<PaginatedResult<FailureType>> {

        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit
        );

        const [data, total] = await Promise.all([
            this.prisma.failure_Type.findMany({
                skip,
                take: limit,
                where: {
                    failureDescription: {
                        contains: query?.search,
                    }
                },
                orderBy: (query?.sortBy && query?.sortOrder) ? {
                    [query.sortBy]: query.sortOrder,
                } : undefined,
            }),

            this.prisma.failure_Type.count({
                where: {
                    failureDescription: {
                        contains: query?.search,
                    },
                },
            }),
        ]);

        return {
            data: data.map((failureType) => this.toDomain(failureType)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<FailureType | undefined> {
        const failureType = await this.prisma.failure_Type.findUnique({
            where: {
                id_failure_type: id,
            },
        });

        return failureType
            ? this.toDomain(failureType)
            : undefined;
    }

    public async create(item: FailureType): Promise<FailureType> {
        const failureType = await this.prisma.failure_Type.create({
            data: {
                id_failure_type: uuidv7(),
                ...item,
            },
        });

        return this.toDomain(failureType);
    }


    public async update(id: string, item: Partial<FailureType>): Promise<FailureType> {

        const failureType = await this.prisma.failure_Type.update({
            where: {
                id_failure_type: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(failureType);
    }

    public async countFailuresByType(id: string): Promise<number> {
        return this.prisma.failure.count({
            where: {
                id_failure_type: id,
            },
        });
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {

        const failureType = await this.prisma.failure_Type.delete({
            where: {
                id_failure_type: id,
            },
        });

        return {
            id: failureType.id_failure_type,
        };
    }

    private toDomain(failureType: Failure_Type): FailureType {
        return new FailureType(
            failureType.failureDescription,
            failureType.estimatedImport.toNumber(),
            failureType.id_failure_type,
        );
    }
}
