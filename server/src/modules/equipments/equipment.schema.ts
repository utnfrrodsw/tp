import { tipo_equipment, brand, model, observations, id, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js"
import { z } from "zod";

export const registerEquipmentSchema = z.object({
    tipo_equipment: tipo_equipment,
    brand: brand,
    model: model,
    observations: observations ?? null,
    id_client: id,
}).strict();

export type RegisterEquipmentDto = z.infer<typeof registerEquipmentSchema>;

export const modifyEquipmentSchema = z.object({
    tipo_equipment: tipo_equipment.optional(),
    brand: brand.optional(),
    model: model.optional(),
    observations: observations.optional(),
    id_client: id.optional(),
}).strict();

export type ModifyEquipmentDto = z.infer<typeof modifyEquipmentSchema>;

export const equipmentQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "tipo_equipment",
        "brand",
        "model",
        "id_client",
        "id_equipment",
        "observations",
    ], "sortBy").default("model"),
});

export type EquipmentQueryDto = z.infer<typeof equipmentQuerySchema>;