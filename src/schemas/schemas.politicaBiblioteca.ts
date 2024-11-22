import { z } from "zod";

// No hay schema de alta, el alta se hace con una migración

const politicaBibliotecaPutSchema = z
  .object({
    diasSancionMaxima: z.number().int().gt(0),
    diasPrestamo: z.number().int().gt(0),
    cantPendientesMaximo: z.number().int().gt(0),
  })
  .strict();

const politicaBibliotecaPatchSchema = z
  .object({
    diasSancionMaxima: z.number().int().gt(0).optional(),
    diasPrestamo: z.number().int().gt(0).optional(),
    cantPendientesMaximo: z.number().int().gt(0).optional(),
  })
  .strict();
export { politicaBibliotecaPatchSchema, politicaBibliotecaPutSchema };
