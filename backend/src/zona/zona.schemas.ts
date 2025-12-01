import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Base zona schema
export const zonaBaseSchema = z.object({
  descripcionZona: z
    .string()
    .min(2, 'La descripción de la zona debe tener al menos 2 caracteres')
    .max(100, 'La descripción de la zona no puede exceder los 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s\-\.]+$/,
      'La descripción solo puede contener letras, espacios, guiones y puntos'
    )
    .describe('Descripción de la zona')
    .openapi({
      example: 'Centro',
    }),
});

// Create zona schema
export const createZonaSchema = zonaBaseSchema.extend({
  descripcionZona: zonaBaseSchema.shape.descripcionZona,
});

// Update zona schema (partial for PUT requests)
export const updateZonaSchema = createZonaSchema.partial();

// Zona response schema
export const zonaResponseSchema = z.object({
  id: z.number().describe('ID único de la zona').openapi({
    example: 1,
  }),
  descripcionZona: z.string().describe('Descripción de la zona').openapi({
    example: 'Centro',
  }),
});

// Usuario info for zona relationships
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
});

// Complete zona response with relationships
export const zonaCompleteResponseSchema = z.object({
  id: z.number().describe('ID único de la zona').openapi({
    example: 1,
  }),
  descripcionZona: z.string().describe('Descripción de la zona').openapi({
    example: 'Centro',
  }),
  usuarios: z
    .array(usuarioInfoSchema)
    .describe('Usuarios asociados a esta zona'),
});

// Find all zonas response
export const findAllZonasResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found all Zonas',
  }),
  data: z
    .array(zonaCompleteResponseSchema)
    .describe('Lista completa de zonas con sus usuarios asociados'),
});

// Simple zonas list (without relationships)
export const findAllZonasSimpleResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found all Zonas',
  }),
  data: z
    .array(zonaResponseSchema)
    .describe('Lista simple de zonas sin relaciones'),
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
          example: 'descripcionZona',
        }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'Descripción inválida',
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
    .describe('ID numérico de la zona')
    .openapi({
      example: '1',
    }),
});

export const findAllZonasConUsuariosResponseSchema = z.object({
  id: z.number().describe('ID único de la zona').openapi({
    example: 1,
  }),
  descripcionZona: z.string().describe('Descripción de la zona').openapi({
    example: 'Centro',
  }),
  selected: z
    .boolean()
    .describe('Indica si la zona está seleccionada por el usuario')
    .openapi({
      example: true,
    }),
});

export const updateByUserValidation = z.object({
  estado: z.boolean().describe('Estado de selección de la zona').openapi({
    example: true,
  }),
});

// Query parameters for pagination

// Validation schemas for middleware
export const createZonaValidation = createZonaSchema;
export const updateZonaValidation = updateZonaSchema;
export const idParamValidation = idParamSchema;
