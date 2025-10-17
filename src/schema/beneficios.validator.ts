import { z } from 'zod';

export const createBeneficioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discount: z.number().positive('Discount must be positive'),
  discountType: z.string().min(1, 'Discount type is required'),
  category: z.string().min(1, 'Category is required'),
  availableDays: z.array(z.number().min(0).max(6)).min(1, 'At least one day is required'),
  validity: z.string().min(1, 'Validity is required'),
  fecha_desde: z.string().min(1, 'Fecha desde is required'),
  fecha_hasta: z.string().min(1, 'Fecha hasta is required'),
  limit: z.string().min(1, 'Limit is required'),
  walletId: z.string().min(1, 'Wallet ID is required'),
  rubroId: z.string().min(1, 'Rubro ID is required'),
  icon: z.string().optional(),
  tope_reintegro: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  localidades: z.array(z.string()).optional(),
});

export const updateBeneficioSchema = createBeneficioSchema.partial();
