import { z } from "zod";

const autorAltaSchema = z
  .object({
    nombre: z.string(),
    apellido: z.string(),
  })
  .strict();

const autorPatchSchema = z
  .object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
  })
  .strict();

export { autorAltaSchema, autorPatchSchema };
