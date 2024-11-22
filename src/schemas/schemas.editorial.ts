import { z } from "zod";

const editorialAltaSchema = z
  .object({
    nombre: z.string().max(15),
  })
  .strict();

const editorialPatchSchema = z
  .object({
    nombre: z.string().max(15),
  })
  .strict();

export { editorialAltaSchema, editorialPatchSchema };
