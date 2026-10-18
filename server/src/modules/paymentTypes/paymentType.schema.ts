import { name, paymentMethod, typeOfPayment, percentage, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js"
import { z } from "zod";

export const newPaymentTypeSchema = z.object({
    paymentTypeName: name,
    paymentMethod: paymentMethod,
    type_of_payment: typeOfPayment,
    percentage: percentage
}).strict();

export type NewPaymentTypeDto = z.infer<typeof newPaymentTypeSchema>;

export const modifyTypePaymentSchema = z.object({
    paymentTypeName: name.optional(),
    paymentMethod: paymentMethod.optional(),
    type_of_payment: typeOfPayment.optional(),
    percentage: percentage.optional()
});

export type ModifyPaymentTypeDto = z.infer<typeof modifyTypePaymentSchema>;

export const typePaymentQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "paymentTypeName",
        "paymentMethod",
        "type_of_payment",
        "id_payment_type",
        "percentage",
    ], "sortBy").default("paymentTypeName"),
});

export type PaymentTypeQueryDto = z.infer<typeof typePaymentQuerySchema>;
