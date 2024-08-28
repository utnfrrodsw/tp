import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

export const createEventSchema = z.object({
    body: z.object({
        name: z.string().min(1, "nombre necesaria"),
        description: z.string().min(1, "Descripcion necesaria"),
        fecha: z.string().refine(date => !isNaN(Date.parse(date)), "Fecha inválida"),
        hora: z.string().regex(timeRegex, "Invalid time format"),
        cupo: z.number().positive().min(1, "debe ser 1 como minimo"),
    })
})