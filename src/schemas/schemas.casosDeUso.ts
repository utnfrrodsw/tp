import { z } from "zod";

export const devolverLibroRequest = z.object({
  idSocio: z.number().int().gt(0),
});

export const devolverLibroParams = z.object({
  id: z.coerce.number().int().gt(0),
  idLP: z.coerce.number().int().gt(0),
});
