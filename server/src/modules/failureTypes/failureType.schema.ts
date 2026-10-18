import { description, price, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js"
import { z } from "zod";

export const newFailureTypeSchema = z.object({
    failureDescription: description,
    estimatedImport: price,
}).strict();

export type NewFailureTypeDto = z.infer<typeof newFailureTypeSchema>;

export const modifyFailureTypeSchema = z.object({
    failureDescription: description.optional(),
    estimatedImport: price.optional(),
}).strict();

export type ModifyFailureTypeDto = z.infer<typeof modifyFailureTypeSchema>;

export const failureTypeQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "failureDescription",
        "estimatedImport",
        "id_failure_type",
    ], "sortBy").default("estimatedImport"),
});

export type FailureTypeQueryDto = z.infer<typeof failureTypeQuerySchema>