import type { Equipment as Equipment_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { EquipmentQueryDto } from "./equipment.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { Equipment } from "./equipment.entity.js";
import { v7 as uuidv7 } from "uuid";

export class EquipmentRepository extends BaseRepository<Equipment, EquipmentQueryDto> {

    public async findAll(query?: EquipmentQueryDto): Promise<PaginatedResult<Equipment>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const [data, total] = await Promise.all([
            this.prisma.equipment.findMany({
                skip,
                take: limit,
                where: {
                    OR: [
                        {
                            brand: {
                                contains: query?.search,
                            },
                        }, {
                            model: {
                                contains: query?.search,
                            },
                        }, {
                            observations: {
                                contains: query?.search,
                            },
                        },
                    ],
                },
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? {
                        [query.sortBy]: query.sortOrder,
                    }
                    : undefined,
            }),

            this.prisma.equipment.count({
                where: {
                    OR: [
                        {
                            brand: {
                                contains: query?.search,
                            },
                        },
                        {
                            model: {
                                contains: query?.search,
                            },
                        },
                        {
                            observations: {
                                contains: query?.search,
                            },
                        },
                    ],
                },
            }),
        ]);

        return {
            data: data.map((equipment) => this.toDomain(equipment)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<Equipment | undefined> {
        const equipment = await this.prisma.equipment.findUnique({
            where: {
                id_equipment: id,
            },
        });

        return equipment
            ? this.toDomain(equipment)
            : undefined;
    }

    // Nuevo: reemplaza al viejo `getEquipmentOfClient` que pegaba
    // directo a prisma desde el controller. Sin paginar, igual que
    // hacía la versión anterior; si después necesitás paginación acá
    // también, se puede adaptar con this.getPagination() como en findAll.
    public async findByClientId(clientId: string): Promise<Equipment[]> {
        const equipments = await this.prisma.equipment.findMany({
            where: {
                id_client: clientId,
            },
        });

        return equipments.map((equipment) => this.toDomain(equipment));
    }

    public async create(item: Equipment): Promise<Equipment> {
        const equipment = await this.prisma.equipment.create({
            data: {
                id_equipment: uuidv7(),
                ...item,
            },
        });

        return this.toDomain(equipment);
    }

    public async update(id: string, item: Partial<Equipment>): Promise<Equipment | undefined> {
        const equipment = await this.prisma.equipment.update({
            where: {
                id_equipment: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(equipment);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const equipment = await this.prisma.equipment.delete({
            where: {
                id_equipment: id,
            },
        });

        return {
            id: equipment.id_equipment,
        };
    }

    private toDomain(equipment: Equipment_P): Equipment {
        return new Equipment(
            equipment.tipo_equipment,
            equipment.brand,
            equipment.model,
            equipment.id_client,
            equipment.id_equipment,
            equipment.observations ?? undefined,
        );
    }
}