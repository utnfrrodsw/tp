import { z } from "zod";

const editorialAltaSchema = z
  .object({
    nombre: z.string().max(15),
  })
  .strict();

const editorialPatchSchema = z
  .object({
    nombre: z.string().optional(),
  })
  .strict();

export { editorialAltaSchema, editorialPatchSchema };
