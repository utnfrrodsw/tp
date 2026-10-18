import { id, observations, enumSchema } from "@/utils/fields.js";
import { QuerySchema } from "@/shared/common.schema.js";
import { z } from "zod";

export const registerStatusSchema = z.object({
    id_order: id,
    id_user: id,
    status: enumSchema([
        "recibido",
        "diagnostico",
        "presupuestado",
        "aprobado",
        "reparacion",
        "listo",
        "entregado",
        "cancelado",
    ], "status"),
    comment: observations.optional(),
    // TODO: usar este flag en el controller para disparar la notificación
    // al cliente (mail/whatsapp/etc) cuando corresponda.
    notifyClient: z.boolean().optional(),
}).strict();

export type RegisterStatusDto = z.infer<typeof registerStatusSchema>;

export const statusQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "dateOfChange",
        "status",
    ], "sortBy").default("dateOfChange"),
});

export type StatusQueryDto = z.infer<typeof statusQuerySchema>;