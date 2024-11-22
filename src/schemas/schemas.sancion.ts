import { z } from "zod";

export const buscarSancionesSocioSchema = z
  .object({
    idSocio: z.number().int().gt(0),
  })
  .strict();
