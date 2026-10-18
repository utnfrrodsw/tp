import { z } from "zod";
import { id, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";
import { EnumBudgetStatus } from "@/generated/prisma/browser.js";

export const registerBudgetSchema = z.object({
    id_order: id,
    laborCost: z.number().nonnegative(),
    discount: z.number().nonnegative().optional(),
}).strict();

export type RegisterBudgetDto = z.infer<typeof registerBudgetSchema>;

export const modifyBudgetSchema = z.object({
    laborCost: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    status: enumSchema(["pendiente", "aprobado", "rechazado"], "status").optional(),
}).strict();

export type ModifyBudgetDto = z.infer<typeof modifyBudgetSchema>;

export const budgetQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "laborCost",
        "estimatedTotal",
        "status",
    ], "sortBy").default("estimatedTotal"),
});

export type BudgetQueryDto = z.infer<typeof budgetQuerySchema>;

export type Decision = 'approved' | 'rejected' | 'suggestion';

export const DECISION_TO_STATUS: Record<Decision, EnumBudgetStatus> = {
  approved: 'aprobado',
  rejected: 'rechazado',
  suggestion: 'pendiente', // sigue pendiente, solo se guarda el comentario
};

export const isDecision = (value: unknown): value is Decision =>
  typeof value === 'string' && Object.hasOwn(DECISION_TO_STATUS, value);