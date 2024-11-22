import { z } from "zod";

export const politicaSancionAltaSchema = z
  .object({
    diasHasta: z.number().int().gt(0),
    diasSancion: z.number().int().gt(0),
  })
  .strict();

export const politicaSancionPutSchema = z
  .object({
    diasSancion: z.number().int().gt(0),
  })
  .strict();

//No hay patch por el momento, solo se puede modificar dias sancion.
