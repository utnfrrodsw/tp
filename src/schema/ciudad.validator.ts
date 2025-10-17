import { z } from 'zod';

export const createCiudadSchema = z.object({
  nombreCiudad: z.string().min(1, 'Nombre ciudad is required'),
  localidadId: z.string().min(1, 'Localidad ID is required'),
  codigoPostal: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

export const updateCiudadSchema = createCiudadSchema.partial();
