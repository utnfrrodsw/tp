import { z } from "zod";

const socioAltaSchema = z
  .object({
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    domicilio: z.string(),
    telefono: z.string(), // Se puede lograr una mejor validación definiendo algun patrón.
  })
  .strict();

const socioPatchSchema = z
  .object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    email: z.string().email().optional(),
    domicilio: z.string().optional(),
    telefono: z.string().optional(),
  })
  .strict();

export { socioAltaSchema, socioPatchSchema };
