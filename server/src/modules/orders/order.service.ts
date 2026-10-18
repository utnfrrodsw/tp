import type { PrismaClient } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { OrderQueryDto } from "./order.schema.js";
import type { OrderRepository } from "./order.repository.js";
import type { Order } from "./order.entity.js";
import type { StatusService } from "@/modules/status/status.service.js";
import type { RegisterOrderDto } from "./order.schema.js";
import { v7 as uuidv7 } from "uuid";

type CreateOrderInput = Omit<RegisterOrderDto, "estimatedDate"> & {
    status: Order["status"];
    dateOfEntry: Date;
    estimatedDate?: Date;
};

export class OrderService {
    constructor(
        private prisma: PrismaClient,
        private repo: OrderRepository,
        private statusService: StatusService,
    ) { }
    findAll(query?: OrderQueryDto): Promise<PaginatedResult<Order>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<Order | undefined> {
        return this.repo.findById(id);
    }

    findByEquipmentId(equipmentId: string): Promise<Order[]> {
        return this.repo.findByEquipmentId(equipmentId);
    }
    getStats() {
        return this.repo.getStats();
    }
    async create(input: CreateOrderInput): Promise<Order | undefined> {
        const { id_client, equipment, failures, id_user, ...orderFields } = input;

        const id_order = await this.prisma.$transaction(async (tx) => {
            // 1. Resolver equipo
            let id_equipment: string;

            if ("id_equipment" in equipment) {
                const existing = await tx.equipment.findFirst({
                    where: { id_equipment: equipment.id_equipment, id_client },
                });
                if (!existing) {
                    throw new Error(
                        "El equipo no existe o no pertenece al cliente seleccionado"
                    );
                }
                id_equipment = equipment.id_equipment;
            } else {
                const newEquipment = await tx.equipment.create({
                    data: {
                        id_equipment: uuidv7(),
                        tipo_equipment: equipment.tipo_equipment,
                        brand: equipment.brand,
                        model: equipment.model,
                        observations: equipment.observations ?? undefined,
                        id_client,
                    },
                });
                id_equipment = newEquipment.id_equipment;
            }

            // 2. Crear orden (repo.create acepta el `tx`)
            const order = await this.repo.create(
                {
                    id_equipment,
                    id_user: id_user ?? undefined,
                    status: orderFields.status,
                    observations: orderFields.observations ?? undefined,
                    equipmentPhotoUrl: orderFields.equipmentPhotoUrl ?? undefined,
                    dateOfEntry: orderFields.dateOfEntry,
                    estimatedDate: orderFields.estimatedDate ?? undefined,
                } as Order,
                tx,
            );

            const id_order = order.id_order!;

            // 3. Crear fallas
            await tx.failure.createMany({
                data: failures.map((f) => ({
                    id_failure: uuidv7(),
                    id_order,
                    id_failure_type: f.id_failure_type,
                    description: f.description,
                })),
            });


            // 4. Status history inicial (dentro de la misma transacción)
            if (id_user) {
                await this.statusService.createFirstStatus(
                    id_order,
                    id_user,
                    order.status!,
                    tx, // <-- requiere que este método acepte un client transaccional
                );
            }

            return id_order;
        });

        // fuera de la transacción: releemos con todas las relaciones
        return this.repo.findById(id_order);
    }

    update(id: string, input: Partial<Order>): Promise<Order | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}