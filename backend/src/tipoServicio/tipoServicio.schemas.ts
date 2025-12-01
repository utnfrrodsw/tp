import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { de, id, ta } from 'zod/v4/locales';

extendZodWithOpenApi(z);
// ===================================================================================================================
// ========================================== schema de usuario =========================================
// ===================================================================================================================

export const usuarioSchema = z.object({
  id: z.number().int().positive().describe('ID del usuario').openapi({
    example: 1,
  }),
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .describe('Nombre del usuario')
    .openapi({
      example: 'Juan',
    }),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El apellido solo puede contener letras y espacios'
    )
    .describe('Apellido del usuario')
    .openapi({
      example: 'Pérez',
    }),
  mail: z
    .string()
    .email('El email debe tener un formato válido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .describe('Correo electrónico del usuario')
    .openapi({
      example: 'juan.perez@gmail.com',
    }),
  tipoDoc: z
    .enum(['DNI', 'CUIT', 'CUIL'], {
      message: 'Tipo de documento debe ser DNI, CUIT o CUIL',
    })
    .describe('Tipo de documento')
    .openapi({
      example: 'DNI',
    }),
  numeroDoc: z
    .string()
    .min(7, 'Número de documento debe tener al menos 7 caracteres')
    .max(13, 'Número de documento no puede exceder 13 caracteres')
    .regex(
      /^[0-9\-]+$/,
      'Número de documento solo puede contener números y guiones'
    )
    .describe('Número de documento')
    .openapi({
      example: '12345678',
    }),
  telefono: z
    .string()
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Formato de teléfono inválido')
    .describe('Número de teléfono')
    .openapi({
      example: '+54 11 1234-5678',
    }),
  direccion: z
    .string()
    .min(5, 'Dirección debe ser más específica')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .describe('Dirección del usuario')
    .openapi({
      example: 'Av. Corrientes 1234',
    }),
  foto: z
    .string()
    .url('La foto debe ser una URL válida')
    .max(200, 'La URL de la foto no puede exceder los 200 caracteres')
    .optional()
    .describe('URL de la foto de perfil del usuario')
    .openapi({
      example: 'http://example.com/foto.jpg',
    }),
  estado: z
    .enum(['activo', 'inactivo'], {
      message: 'El estado debe ser "activo" o "inactivo"',
    })
    .default('activo')
    .describe('Estado del usuario')
    .openapi({
      example: 'activo',
    }),
  nombreFantasia: z
    .string()
    .min(2, 'El nombre de fantasía debe tener al menos 2 caracteres')
    .max(30, 'El nombre de fantasía no puede exceder los 30 caracteres')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Servicios SRL',
    }),

  descripcion: z
    .string()
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Descripción del prestatario')
    .openapi({
      example: 'Ofrecemos servicios de plomería y electricidad.',
    }),
});
// ===================================================================================================================
// ========================================== schema de tarea  =========================================
// ===================================================================================================================

export const tareaSchema = z.object({
  nombreTarea: z
    .string()
    .min(
      2,
      'El nombre de la tarea es obligatorio y debe tener entre 2 y 100 caracteres'
    )
    .max(100, 'El nombre de la tarea no puede exceder los 100 caracteres')
    .describe('Nombre de la tarea')
    .openapi({ example: 'Reparación de grifería' }),

  descripcionTarea: z
    .string()
    .max(500, 'La descripción de la tarea no puede exceder los 500 caracteres')
    .optional()
    .describe('Descripción de la tarea')
    .openapi({ example: 'Reparación y mantenimiento de grifería en el hogar' }),

  duracionTarea: z
    .number()
    .positive()
    .describe('Duración de la tarea en minutos')
    .openapi({ example: 60 }),
  tipoServicio: z
    .number()
    .int()
    .positive('El tipo de servicio debe ser un número entero positivo')
    .describe('ID del tipo de servicio asociado a la tarea')
    .openapi({ example: 1 }),
});

// ===================================================================================================================
// ========================================== schema de tipo servicio con id  =========================================
// ===================================================================================================================

export const tipoServicioSchemaBase = z.object({
  nombreTipo: z
    .string()
    .min(2, 'El nombre del tipo de servicio debe tener al menos 2 caracteres')
    .max(
      50,
      'El nombre del tipo de servicio no puede exceder los 50 caracteres'
    )
    .describe('Nombre del tipo de servicio')
    .openapi({
      example: 'Plomería',
    }),
  descripcionTipo: z
    .string()
    .min(5, 'La descripción debe ser más específica')
    .max(200, 'La descripción no puede exceder los 200 caracteres')
    .describe('Descripción del tipo de servicio')
    .openapi({
      example: 'Servicios de plomería profesional',
    }),
  usuarios: z.array(z.object({ id: z.number().int().positive() })),
  tareas: z.array(z.object({ id: z.number().int().positive() })),
});

// ===================================================================================================================
// ========================================== schema de tipo servicio completo  =========================================
// ===================================================================================================================

export const tipoServicioSchema = z.object({
  nombreTipo: z
    .string()
    .min(2, 'El nombre del tipo de servicio debe tener al menos 2 caracteres')
    .max(
      50,
      'El nombre del tipo de servicio no puede exceder los 50 caracteres'
    )
    .describe('Nombre del tipo de servicio')
    .openapi({
      example: 'Plomería',
    }),
  descripcionTipo: z
    .string()
    .min(5, 'La descripción debe ser más específica')
    .max(200, 'La descripción no puede exceder los 200 caracteres')
    .describe('Descripción del tipo de servicio')
    .openapi({
      example: 'Servicios de plomería profesional',
    }),
  usuarios: z.array(usuarioSchema).optional(), // Usuarios opcionales
  tareas: z.array(tareaSchema).optional(), // Tareas opcionales
});
// ===================================================================================================================
// ========================================== schema de tipoServicio para crear =========================================
// ===================================================================================================================

export const createTipoServicioSchema = z.object({
  nombreTipo: z
    .string()
    .min(2, 'El nombre del tipo de servicio debe tener al menos 2 caracteres')
    .max(50, 'El nombre del tipo de servicio no puede exceder los 50 caracteres'),
  descripcionTipo: z
    .string()
    .min(5, 'La descripción debe ser más específica')
    .max(200, 'La descripción no puede exceder los 200 caracteres'),
  usuarios: z.array(usuarioSchema).optional(),
  tareas: z.array(tareaSchema).optional(),
}).openapi({
  title: 'CreateTipoServicio',
  description: 'Esquema para crear un nuevo tipo de servicio',
});

// ===================================================================================================================
// ========================================== schema de tipoServicio para actualizar =========================================
// ===================================================================================================================

export const updateTipoServicioSchema = createTipoServicioSchema.partial().openapi({
  title: 'UpdateTipoServicio',
  description: 'Esquema para actualizar un tipo de servicio',
});

// ===================================================================================================================
// ========================================== schema de tipoServicio para crear =========================================
// ===================================================================================================================
export const deleteTipoServicioSchema = tipoServicioSchema.openapi({
  title: 'DeleteTipoServicio',
  description: 'Esquema para eliminar un tipo de servicio',
});

export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

// ===================================================================================================================
// ========================================== schema de tipoServicio para get =========================================
// ===================================================================================================================
export const getTipoServicioSchema = tipoServicioSchema.openapi({
  title: 'GetTipoServicio',
  description: 'Esquema para obtener un tipo de servicio',
});

export const idParamValidation = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número entero positivo')
    .openapi({
      example: '1',
    }),
});
