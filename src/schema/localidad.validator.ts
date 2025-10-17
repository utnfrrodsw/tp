import { z } from 'zod';

export const createLocalidadSchema = z.object({
  nombre_localidad: z.string().min(1, 'Nombre localidad is required'),
  pais: z.string().default('Argentina'),
});

export const updateLocalidadSchema = createLocalidadSchema.partial();
