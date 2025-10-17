import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  descripcion: z.string().min(1, 'Descripcion is required'),
  interes_anual: z.number().optional(),
  personas: z.array(z.string()).optional(),
});

export const updateWalletSchema = createWalletSchema.partial();
