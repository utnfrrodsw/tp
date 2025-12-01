import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Base servicio schema matching your entity
export const servicioBaseSchema = z.object({
  estado: z
    .enum(['activo', 'inactivo'])
    .describe('Estado del servicio')
    .openapi({
      example: 'activo',
    }),
  precio: z
    .number()
    .positive('El precio debe ser un número positivo')
    .describe('Precio del servicio')
    .openapi({
      example: 1500,
    }),
  tarea: z
    .number()
    .int()
    .positive('El ID de la tarea debe ser un número entero positivo')
    .describe('ID de la tarea asociada al servicio')
    .openapi({
      example: 1,
    }),
  usuario: z
    .number()
    .int()
    .positive('El ID del usuario debe ser un número entero positivo')
    .nullable()
    .optional()
    .describe('ID del usuario asociado al servicio (opcional)')
    .openapi({
      example: 2,
    }),
});

// Create servicio schema
export const createServicioSchema = servicioBaseSchema.extend({
  estado: servicioBaseSchema.shape.estado.default('activo'),
  precio: servicioBaseSchema.shape.precio,
  tarea: servicioBaseSchema.shape.tarea,
  usuario: servicioBaseSchema.shape.usuario,
});

// Update servicio schema (partial for PUT requests)
export const updateServicioSchema = servicioBaseSchema.partial();

// Upsert schema for upsertByUserAndTask endpoint
export const upsertServicioSchema = z.object({
  tareaId: z
    .number()
    .int()
    .positive('El ID de la tarea debe ser un número entero positivo')
    .describe('ID de la tarea')
    .openapi({
      example: 1,
    }),
  usuarioId: z
    .number()
    .int()
    .positive('El ID del usuario debe ser un número entero positivo')
    .describe('ID del usuario')
    .openapi({
      example: 2,
    }),
  precio: z
    .number()
    .positive('El precio debe ser un número positivo')
    .describe('Precio del servicio')
    .openapi({
      example: 2500,
    }),
});

// Tarea info schema for responses
export const tareaInfoSchema = z.object({
  id: z.number().describe('ID de la tarea').openapi({
    example: 1,
  }),
  nombreTarea: z.string().describe('Nombre de la tarea').openapi({
    example: 'Reparación de canillas',
  }),
  descripcionTarea: z.string().describe('Descripción de la tarea').openapi({
    example: 'Arreglo y mantenimiento de grifería',
  }),
  duracionTarea: z
    .number()
    .describe('Duración estimada de la tarea en minutos')
    .openapi({
      example: 60,
    }),
  tipoServicio: z
    .object({
      id: z.number(),
      nombreTipo: z.string(),
      descripcionTipo: z.string(),
    })
    .describe('Tipo de servicio asociado a la tarea'),
});

// Usuario info schema for responses
export const usuarioInfoSchema = z.object({
  id: z.number().describe('ID del usuario').openapi({
    example: 1,
  }),
  nombre: z.string().describe('Nombre del usuario').openapi({
    example: 'Juan',
  }),
  apellido: z.string().describe('Apellido del usuario').openapi({
    example: 'Pérez',
  }),
  mail: z.string().describe('Email del usuario').openapi({
    example: 'juan.perez@gmail.com',
  }),
  nombreFantasia: z
    .string()
    .nullable()
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Plomería Pérez',
    }),
  telefono: z.string().optional().describe('Teléfono del usuario').openapi({
    example: '+54 11 1234-5678',
  }),
});

// Turno info schema for responses
export const turnoInfoSchema = z.object({
  id: z.number().describe('ID del turno').openapi({
    example: 1,
  }),
  fechaTurno: z.string().describe('Fecha del turno').openapi({
    example: '2024-03-15',
  }),
  horaTurno: z.string().describe('Hora del turno').openapi({
    example: '14:30',
  }),
  estado: z.string().describe('Estado del turno').openapi({
    example: 'confirmado',
  }),
});

// Servicio response schema (basic)
export const servicioResponseSchema = z.object({
  id: z.number().describe('ID único del servicio').openapi({
    example: 1,
  }),
  estado: z.string().describe('Estado del servicio').openapi({
    example: 'activo',
  }),
  precio: z.number().describe('Precio del servicio').openapi({
    example: 1500,
  }),
});

// Complete servicio response with relationships
export const servicioCompleteResponseSchema = z.object({
  id: z.number().describe('ID único del servicio').openapi({
    example: 1,
  }),
  estado: z.string().describe('Estado del servicio').openapi({
    example: 'activo',
  }),
  precio: z.number().describe('Precio del servicio').openapi({
    example: 1500,
  }),
  tarea: tareaInfoSchema.describe('Información de la tarea asociada'),
  usuario: usuarioInfoSchema
    .nullable()
    .describe(
      'Información del usuario que ofrece el servicio (puede ser null)'
    ),
  turnos: z
    .array(turnoInfoSchema)
    .optional()
    .describe('Turnos asociados al servicio'),
});

// Find all servicios response
export const findAllServiciosResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found all services',
  }),
  data: z
    .array(servicioCompleteResponseSchema)
    .describe('Lista completa de servicios con sus relaciones'),
});

// Find servicios by usuario response
export const findServiciosByUsuarioResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'Servicios encontrados',
  }),
  data: z
    .array(servicioCompleteResponseSchema)
    .describe('Lista de servicios del usuario especificado'),
});

// Upsert response schema
export const upsertServicioResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'Servicio creado',
  }),
  data: servicioCompleteResponseSchema.describe(
    'Servicio creado o actualizado'
  ),
  action: z.enum(['created', 'updated']).describe('Acción realizada').openapi({
    example: 'created',
  }),
});

// Error response schema
export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'Validation failed',
  }),
  errors: z
    .array(
      z.object({
        field: z.string().describe('Campo que falló').openapi({
          example: 'precio',
        }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'El precio debe ser un número positivo',
        }),
      })
    )
    .optional()
    .describe('Detalles de errores de validación'),
});

// Success message schema
export const successMessageSchema = z.object({
  message: z.string().describe('Mensaje de éxito').openapi({
    example: 'Operación completada exitosamente',
  }),
});

// Parameter validation schemas
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID debe ser un número válido')
    .describe('ID numérico del servicio')
    .openapi({
      example: '1',
    }),
});

export const usuarioIdParamSchema = z.object({
  usuarioId: z
    .string()
    .regex(/^\d+$/, 'Usuario ID debe ser un número válido')
    .describe('ID numérico del usuario')
    .openapi({
      example: '1',
    }),
});

export const userTaskParamsSchema = z.object({
  usuarioId: z
    .string()
    .regex(/^\d+$/, 'Usuario ID debe ser un número válido')
    .describe('ID numérico del usuario')
    .openapi({
      example: '1',
    }),
  tareaId: z
    .string()
    .regex(/^\d+$/, 'Tarea ID debe ser un número válido')
    .describe('ID numérico de la tarea')
    .openapi({
      example: '1',
    }),
});

// Query parameters for filtering
export const servicioQuerySchema = z.object({
  estado: z
    .enum(['activo', 'inactivo'])
    .optional()
    .describe('Filtrar por estado del servicio')
    .openapi({
      example: 'activo',
    }),
  precioMin: z.coerce
    .number()
    .positive()
    .optional()
    .describe('Precio mínimo para filtrar')
    .openapi({
      example: 1000,
    }),
  precioMax: z.coerce
    .number()
    .positive()
    .optional()
    .describe('Precio máximo para filtrar')
    .openapi({
      example: 5000,
    }),
  tareaId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filtrar por ID de tarea específica')
    .openapi({
      example: 1,
    }),
});

// Validation schemas for middleware
export const createServicioValidation = createServicioSchema;
export const updateServicioValidation = updateServicioSchema;
export const upsertServicioValidation = upsertServicioSchema;
export const idParamValidation = idParamSchema;
export const usuarioIdParamValidation = usuarioIdParamSchema;
export const userTaskParamsValidation = userTaskParamsSchema;
export const servicioQueryValidation = servicioQuerySchema;
