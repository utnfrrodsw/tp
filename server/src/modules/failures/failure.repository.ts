import { BaseRepository } from "@/shared/base.repository.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { FailureQueryDto } from "./failure.schema.js";
import { Failure } from "./failure.entity.js";
import type { Failure as Failure_P, Prisma } from "@/generated/prisma/client.js";
import { v7 as uuidv7 } from "uuid";

type FailureWithType = Failure_P & Prisma.FailureGetPayload<{ include: { failureType: true } }>;

export class FailureRepository extends BaseRepository<Failure, FailureQueryDto> {

    public async findAll(query?: FailureQueryDto): Promise<PaginatedResult<Failure>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit
        );

        // El campo real del modelo es "description", no "failureDescription"
        // (ese es el nombre del campo en el DTO de creación, no en la tabla).
        const where = query?.search ? {
            description: {
                contains: query.search,
            },
        } : {};

        const [data, total] = await Promise.all([
            this.prisma.failure.findMany({
                skip,
                take: limit,
                where,
                orderBy: (query?.sortBy && query?.sortOrder) ? {
                    [query.sortBy]: query.sortOrder,
                } : undefined,
            }),

            this.prisma.failure.count({ where }),
        ]);

        return {
            data: data.map((failure) => this.toDomain(failure)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<Failure | undefined> {
        const failure = await this.prisma.failure.findUnique({
            where: {
                id_failure: id,
            },
        });

        return failure
            ? this.toDomain(failure)
            : undefined;
    }

    // Antes era findByEquipmentId: la falla ahora cuelga de la orden, no
    // del equipo (ver nota en el schema de Prisma).
    public async findByOrderId(id_order: string): Promise<Failure[]> {
        const failures = await this.prisma.failure.findMany({
            where: { id_order },
        });

        return failures.map((failure) => this.toDomain(failure));
    }

    public async create(item: Failure): Promise<Failure> {
        const failure = await this.prisma.failure.create({
            data: {
                id_failure: uuidv7(),
                id_failure_type: item.id_failure_type,
                id_order: item.id_order,
                description: item.description,
                status: item.status,
            },
        });

        return this.toDomain(failure);
    }

    // Carga múltiple: todo o nada, en una sola transacción.
    public async createMany(items: Failure[]): Promise<Failure[]> {
        const created = await this.prisma.$transaction(
            items.map((item) =>
                this.prisma.failure.create({
                    data: {
                        id_failure: uuidv7(),
                        id_failure_type: item.id_failure_type,
                        id_order: item.id_order,
                        description: item.description,
                        status: item.status,
                    },
                    include: { failureType: true },
                }),
            ),
        );

        return created.map((failure) => this.toDomain(failure));
    }

    public async update(id: string, item: Partial<Failure>): Promise<Failure | undefined> {
        const { failureType: _failureType, ...rest } = item;

        const failure = await this.prisma.failure.update({
            where: {
                id_failure: id,
            },
            data: {
                ...rest,
            },
            include: { failureType: true },
        });

        return this.toDomain(failure);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const failure = await this.prisma.failure.delete({
            where: {
                id_failure: id,
            },
        });

        return {
            id: failure.id_failure,
        };
    }

    private toDomain(failure: Failure_P | FailureWithType): Failure {
        return new Failure(
            failure.id_failure_type,
            failure.id_order,
            failure.description,
            failure.id_failure,
            failure.dateOfFailure,
            failure.status,
            "failureType" in failure ? failure.failureType ?? undefined : undefined,
        );
    }
}