import { name, cant_n, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js"
import { z } from "zod"

export const newClientTypeSchema = z.object({
    clientTypeName: name,
    amountForCategoryUp: cant_n("amountForCategoryUp")
}).strict();

export type NewClientTypeDto = z.infer<typeof newClientTypeSchema>

export const modifyClientTypeSchema = z.object({
    clientTypeName: name.optional(),
    amountForCategoryUp: cant_n("amountForCategoryUp").optional()
}).strict();

export type ModifyClientTypeDto = z.infer<typeof modifyClientTypeSchema>

export const clientTypeQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "clientTypeName",
        "amountForCategoryUp",
        "id_client_type",
    ], "sortBy").default("clientTypeName"),
});

export type ClientTypeQueryDto = z.infer<typeof clientTypeQuerySchema>