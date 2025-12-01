import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { id } from 'zod/v4/locales';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// ==================== CONSTANTES ====================
const ERROR_MESSAGES = {
  nombreTarea:
    'El nombre de la tarea es obligatorio y debe tener entre 2 y 100 caracteres',
  descripcionTarea:
    'La descripción de la tarea no puede exceder los 500 caracteres',
  duracionTarea: 'La duración de la tarea debe ser un número positivo',
  tipoServicio: 'El ID del tipo de servicio debe ser un número entero positivo',
};

// ===================================================================================================================
// ========================================== servicio schema =========================================
// ===================================================================================================================
export const servicioSchema = z.object({
  id: z.number().describe('ID del servicio').openapi({
    example: 1,
  }),
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
// ===================================================================================================================
// ========================================== tipoServicio schema =========================================
// ===================================================================================================================

export const tipoServicioSchema = z.object({
  id: z.number().describe('ID del tipo de servicio').openapi({
    example: 1,
  }),
  nombreTipo: z.string().describe('Nombre del tipo de servicio').openapi({
    example: 'Plomería',
  }),
  descripcionTipo: z
    .string()
    .describe('Descripción del tipo de servicio')
    .openapi({
      example: 'Servicios de plomería profesional',
    }),
});

// ===================================================================================================================
// ========================================== schema de tarea basico =========================================
// ===================================================================================================================

export const tareaBaseSchema = z.object({
  nombreTarea: z
    .string()
    .min(2, ERROR_MESSAGES.nombreTarea)
    .max(100, ERROR_MESSAGES.nombreTarea)
    .describe('Nombre de la tarea')
    .openapi({ example: 'Reparación de grifería' }),

  descripcionTarea: z
    .string()
    .max(500, ERROR_MESSAGES.descripcionTarea)
    .optional()
    .describe('Descripción de la tarea')
    .openapi({ example: 'Reparación y mantenimiento de grifería en el hogar' }),

  duracionTarea: z
    .number()
    .positive(ERROR_MESSAGES.duracionTarea)
    .describe('Duración de la tarea en minutos')
    .openapi({ example: 60 }),
});
// ===================================================================================================================
// ========================================== schema de tarea basico con id de tipo servicio  =========================================
// ===================================================================================================================
export const tareaBaseSchemaWithTipoServicioId = tareaBaseSchema.extend({
  tipoServicio: z
    .number()
    .int()
    .positive(ERROR_MESSAGES.tipoServicio)
    .describe('ID del tipo de servicio')
    .openapi({ example: 1 }),
  servicioSchema: servicioSchema,
});

// ===================================================================================================================
// ========================================== schema de crear tarea =========================================
// ===================================================================================================================

export const createTareaValidation = tareaBaseSchema
  .extend({
    tipoServicio: z
      .number()
      .int()
      .positive(ERROR_MESSAGES.tipoServicio)
      .describe('ID del tipo de servicio')
      .openapi({ example: 1 }),
  })
  .openapi({
    title: 'CreateTarea',
    description: 'Esquema para crear una nueva tarea',
  });

// ===================================================================================================================
// ========================================== schema para actualizar tarea =========================================
// ===================================================================================================================

export const updateTareaValidation = tareaBaseSchema
  .extend({
    tipoServicio: tipoServicioSchema,
  })
  .partial()
  .openapi({
    title: 'UpdateTarea',
    description: 'Esquema para actualizar una tarea existente',
  });

// ===================================================================================================================
// ========================================== schema para eliminar tarea =========================================
// ===================================================================================================================

export const deleteTareaValidation = tareaBaseSchema
  .extend({
    tipoServicio: tipoServicioSchema,
  })
  .partial()
  .openapi({
    title: 'DeleteTarea',
    description: 'Esquema para eliminar una tarea existente',
  });

// ===================================================================================================================
// ========================================== schema para get de  tarea =========================================
// ===================================================================================================================

export const getTareaValidation = tareaBaseSchema
  .extend({
    tipoServicio: tipoServicioSchema,
  })
  .partial()
  .openapi({
    title: 'DeleteTarea',
    description: 'Esquema para eliminar una tarea existente',
  });

// Esquema para validar el parámetro ID
export const idParamValidation = z
  .object({
    id: z
      .string()
      .regex(/^\d+$/, 'El ID debe ser un número entero positivo')
      .describe('ID del recurso')
      .openapi({ example: '1' }),
  })
  .describe('Esquema para validar el parámetro ID');

// ===================================================================================================================
// ========================================== schema para errores  =========================================
// ===================================================================================================================

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'horario no encontrado',
  }),
  errors: z
    .array(
      z.object({
        field: z
          .string()

          .describe('Campo que falló')
          .openapi({ example: 'id' }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'ID inválido',
        }),
      })
    )
    .optional()
    .describe('Detalles de errores de validación'),
});
