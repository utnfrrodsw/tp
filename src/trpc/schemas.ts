import { z } from 'zod';

// Schema común para IDs (string ObjectId)
export const idSchema = z.string().min(1, 'ID is required');

// Schema para Wallet
export const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  descripcion: z.string().min(1, 'Descripcion is required'),
  interes_anual: z.number().optional(),
  personas: z.array(idSchema).optional().default([]),
});

export const updateWalletSchema = createWalletSchema.partial();

// Schema para Persona
export const createPersonaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  apellido: z.string().min(1, 'Apellido is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Must be a valid email'),
  tel: z.string().min(1, 'Phone is required'), // Cambiado de number a string
  dni: z.string().min(1, 'DNI is required'),   // Cambiado de number a string
  direccion: z.string().optional(),
  localidadId: idSchema.optional(),
  wallets: z.array(idSchema).optional().default([]),
});

export const updatePersonaSchema = createPersonaSchema.partial();

// Schema para Localidad
export const createLocalidadSchema = z.object({
  nombre_localidad: z.string().min(1, 'Nombre localidad is required'),
  pais: z.string().default('Argentina'),
});

export const updateLocalidadSchema = createLocalidadSchema.partial();

// Schema para Ciudad
export const createCiudadSchema = z.object({
  nombreCiudad: z.string().min(1, 'Nombre ciudad is required'),
  codigoPostal: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  localidadId: idSchema,
});

export const updateCiudadSchema = createCiudadSchema.partial();

// Schema para Rubro
export const createRubroSchema = z.object({
  nombre: z.string().min(1, 'Nombre is required'),
  descripcion: z.string().min(1, 'Descripcion is required'),
});

export const updateRubroSchema = createRubroSchema.partial();

// Schema para Beneficio
export const createBeneficioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discount: z.number().positive('Discount must be positive'),
  discountType: z.string().min(1, 'Discount type is required'),
  icon: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  availableDays: z.array(z.number().min(0).max(6)).min(1, 'At least one day is required'),
  validity: z.string().min(1, 'Validity is required'),
  fecha_desde: z.string().min(1, 'Fecha desde is required'),
  fecha_hasta: z.string().min(1, 'Fecha hasta is required'),
  limit: z.string().min(1, 'Limit is required'),
  tope_reintegro: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  walletId: idSchema,
  rubroId: idSchema,
  localidades: z.array(idSchema).optional().default([]),
});

export const updateBeneficioSchema = createBeneficioSchema.partial();

// Schema para Notificacion
export const createNotificacionSchema = z.object({
  min_descuento: z.number().positive('Min descuento must be positive'),
  tipos_beneficio: z.array(z.string()).optional().default([]),
  medio_envio: z.string().min(1, 'Medio envio is required'),
  activo: z.boolean().default(true),
  fecha_creacion: z.date().optional(),
  fecha_ultima_notificacion: z.date().optional(),
  personaId: idSchema,
  wallets: z.array(idSchema).optional().default([]),
});

export const updateNotificacionSchema = createNotificacionSchema.partial();