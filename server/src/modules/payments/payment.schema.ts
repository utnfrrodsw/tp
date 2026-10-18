import { z } from "zod";
import { id, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";

export const registerPaymentSchema = z.object({
    id_budget: id,
    id_payment_type: id,
    amount: z.number().positive(),
}).strict();

export type RegisterPaymentDto = z.infer<typeof registerPaymentSchema>;

export const paymentQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "amount",
        "dateOfPayment",
    ], "sortBy").default("dateOfPayment"),
});

export type PaymentQueryDto = z.infer<typeof paymentQuerySchema>;
