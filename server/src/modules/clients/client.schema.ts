import { z } from "zod";
import { name, phone, email, cuit, date, id } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";
import { enumSchema } from "@/utils/fields.js";

export const createClientSchema = z.object({
    clientName: name,
    clientEmail: email,
    clientPhone: phone,
    cuit: cuit,
}).strict();

export type CreateClientDto = z.infer<typeof createClientSchema>;

export const modifyClientSchema = z.object({
    clientName: name.optional(),
    clientEmail: email.optional(),
    clientPhone: phone.optional(),
    cuit: cuit.optional(),
    status: z.boolean().optional(),
}).strict();

export type ModifyClientDto = z.infer<typeof modifyClientSchema>;

export const clientQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "clientName",
        "clientEmail",
        "cuit",
        "dateOfRegistration",
    ], "sortBy").default("dateOfRegistration"),
    dateFrom: date.optional(),
    dateTo: date.optional(),
    id_client_type: id.optional(),
});

export type ClientQueryDto = z.infer<typeof clientQuerySchema>;