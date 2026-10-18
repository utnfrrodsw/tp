import { z } from "zod";
import { id, description, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";

const ADDED_COST_TYPES = [
    "repuesto",
    "procedimientoEspecial",
    "garantia",
    "reparacionExpress",
    "limpiezaPuestaAPunto",
    "serviciosSoftware",
] as const;

export const registerAddedCostSchema = z.object({
    id_budget: id,
    type_addedCost: enumSchema(ADDED_COST_TYPES, "type_addedCost"),
    addedCostDescription: description,
    addedCostAmount: z.number().positive(),
}).strict();

export type RegisterAddedCostDto = z.infer<typeof registerAddedCostSchema>;

export const modifyAddedCostSchema = z.object({
    type_addedCost: enumSchema(ADDED_COST_TYPES, "type_addedCost").optional(),
    addedCostDescription: description.optional(),
    addedCostAmount: z.number().positive().optional(),
}).strict();

export type ModifyAddedCostDto = z.infer<typeof modifyAddedCostSchema>;

export const addedCostQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "addedCostAmount",
        "addedCostDescription",
        "type_addedCost",
    ], "sortBy").default("addedCostAmount"),
});

export type AddedCostQueryDto = z.infer<typeof addedCostQuerySchema>;
