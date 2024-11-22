import { z } from "zod";

const schemaParamsId = z
  .object({
    id: z.coerce.number().int().gt(0),
  })
  .strict();

// Caso especial de Ejemplar (distinta clave)

const schemaParamsIdEjemplar = z
  .object({
    id: z.coerce.number().int().gt(0),
    idEjemplar: z.coerce.number().int().gt(0),
  })
  .strict();
//El req.params que le llega al ejemplarRouter tiene dos claves, id y idEjemplar.

export { schemaParamsId, schemaParamsIdEjemplar };
