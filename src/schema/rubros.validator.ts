import { z } from 'zod';

export const createRubroSchema = z.object({
  nombre: z.string().min(1, 'Nombre is required'),
  descripcion: z.string().min(1, 'Descripcion is required'),
});

export const updateRubroSchema = createRubroSchema.partial();
