import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  errorResponseSchema,
  createPagoValidationSchema,
  getPagoSchema,
  deletePagoSchema,
  pagoBaseSchema,
  validacionIdSchema,
  updatePagoValidationSchema,
  baseSchemaWithTurnoId,
  idUserParamValidation,
} from './pago.schemas.js';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// Crear el pagoRegistry
export const pagoRegistry = new OpenAPIRegistry();

// ===================================================================================================================
// ========================================== Registrar de Pago =========================================
// ===================================================================================================================
pagoRegistry.register('Pago', createPagoValidationSchema);
pagoRegistry.register('CreatePago', createPagoValidationSchema);
pagoRegistry.register('GetPago', getPagoSchema);
pagoRegistry.register('DeletePago', deletePagoSchema);
pagoRegistry.register('UpdatePago', updatePagoValidationSchema);
pagoRegistry.register('ErrorResponse', errorResponseSchema);

// ==================== POST METHODS ====================
pagoRegistry.registerPath({
  method: 'post',
  path: '/api/pago',
  description: 'Crear un nuevo pago',
  summary: 'Crear pago',
  tags: ['Pagos'],
  request: {
    body: {
      description: 'Datos del pago a crear',
      content: {
        'application/json': {
          schema: baseSchemaWithTurnoId,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Pago creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Pago creado exitosamente' }),
            data: createPagoValidationSchema,
          }),
        },
      },
    },
    400: {
      description: 'Error de validación',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== GET METHODS ====================

// GET /api/pago/{id}
pagoRegistry.registerPath({
  method: 'get',
  path: '/api/pago/{id}',
  description: 'Obtener un pago por ID',
  summary: 'Obtener pago',
  tags: ['Pagos'],
  request: {
    params: validacionIdSchema,
  },
  responses: {
    200: {
      description: 'Pago encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Pago encontrado' }),
            data: getPagoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Pago no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

pagoRegistry.registerPath({
  method: 'get',
  path: '/api/estadisticas/{usuarioId}',
  description: 'Obtener los pagos por ID de usuario',
  summary: 'Obtener pagos por usuario',
  tags: ['Pagos'],
  request: {
    params: idUserParamValidation,
  },
  responses: {
    200: {
      description: 'Pago encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Pago encontrado' }),
            data: getPagoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Pago no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

pagoRegistry.registerPath({
  method: 'get',
  path: '/api/pago/',
  description: 'Obtener todos los pagos',
  summary: 'Obtener pagos',
  tags: ['Pagos'],
  responses: {
    200: {
      description: 'Pago encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Pago encontrado' }),
            data: getPagoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Pago no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== PUT METHODS ====================

// PUT /api/pago/{id}
pagoRegistry.registerPath({
  method: 'put',
  path: '/api/pago/{id}',
  description: 'Actualizar un pago existente',
  summary: 'Actualizar pago',
  tags: ['Pagos'],
  request: {
    params: validacionIdSchema,
    body: {
      description: 'Datos del pago a actualizar',
      content: {
        'application/json': {
          schema: updatePagoValidationSchema, // Cambiar a updatePagoValidationSchema
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Pago actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Pago actualizado exitosamente' }),
            data: updatePagoValidationSchema,
          }),
        },
      },
    },
    404: {
      description: 'Pago no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== DELETE METHODS ====================

// DELETE /api/pago/{id}
pagoRegistry.registerPath({
  method: 'delete',
  path: '/api/pago/{id}',
  description: 'Eliminar un pago por ID',
  summary: 'Eliminar pago',
  tags: ['Pagos'],
  request: {
    params: validacionIdSchema,
  },
  responses: {
    200: {
      description: 'Pago eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Pago eliminado exitosamente' }),
            data: deletePagoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Pago no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
