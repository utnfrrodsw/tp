import { id, observations, url, date, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";
import { z } from "zod";

const existingEquipmentSchema = z.object({
    id_equipment: id,
}).strict();

const newEquipmentSchema = z.object({
    tipo_equipment: enumSchema([
        "celular", "computadora", "tablet", "consola",
        "notebook", "impresora", "televisor", "otro",
    ], "tipo_equipment"),
    brand: z.string().min(1),
    model: z.string().min(1),
    observations: observations.nullable().optional(),
}).strict();

const equipmentInputSchema = z.union([existingEquipmentSchema, newEquipmentSchema]);

const failureInputSchema = z.object({
    id_failure_type: id,
    description: z.string().min(1),
}).strict();

export const registerOrderSchema = z.object({
    id_client: id,
    equipment: equipmentInputSchema,
    observations: observations.nullable().optional(),
    equipmentPhotoUrl: url.nullable().optional(),
    estimatedDate: date.nullable().optional(),
    id_user: id.nullable().optional(),
    failures: z.array(failureInputSchema).min(1),
}).strict();

export type RegisterOrderDto = z.infer<typeof registerOrderSchema>;

export const orderQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "dateOfEntry", "estimatedDate", "deliveryDate",
        "totalCharged", "observations", "id_equipment",
    ], "sortBy").default("dateOfEntry"),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>