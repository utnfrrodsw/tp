import { z } from "zod";
import { id, description, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";

export const createFailuresSchema = z.array(
    z.object({
        id_failure_type: id,
        failureDescription: description,
        id_order: id,
    }).strict(),
    {
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "The body must be an array of failures";
            }

            return "Invalid failures body format";
        },
    }
)
    .min(1, {
        error: "At least one failure is required",
    });

export type CreateFailuresDto = z.infer<typeof createFailuresSchema>;

export const failureQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "dateOfFailure",
        "description",
        "status",
    ], "sortBy").default("dateOfFailure"),
});

export type FailureQueryDto = z.infer<typeof failureQuerySchema>;

export const modifyFailureSchema = z.object({
  id_failure_type: id,
  description: description,
}).strict();

export type ModifyFailuresDto = z.infer<typeof modifyFailureSchema>;
