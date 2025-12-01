import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  horarioSchema,
  errorResponseSchema,
  createHorarioValidation,
  updateHorarioValidation,
  deleteHorarioValidation,
  idParamValidation,
  idUserParamValidation,
  getHorarioValidation,
  horarioBaseSchema,
} from './horario.schemas.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// Crear el horarioRegistry
export const horarioRegistry = new OpenAPIRegistry();

// ===================================================================================================================
// ========================================== horarioRegistry =========================================
// ===================================================================================================================
horarioRegistry.register('Horario', horarioSchema);
horarioRegistry.register('ErrorResponse', errorResponseSchema);
horarioRegistry.register('CreateHorario', createHorarioValidation);
horarioRegistry.register('UpdateHorario', updateHorarioValidation);
horarioRegistry.register('DeleteHorario', deleteHorarioValidation);

// ==================== POST METHODS ====================

// POST /api/horario
horarioRegistry.registerPath({
  method: 'post',
  path: '/api/horario',
  description: 'Crear un nuevo horario para un usuario determinado',
  summary: 'Crear horario',
  tags: ['Horarios'],
  request: {
    body: {
      description: 'Datos del horario a crear',
      content: {
        'application/json': {
          schema: horarioBaseSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Horario creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario creado exitosamente' }),
            data: createHorarioValidation,
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

// GET /api/horario/{id}
horarioRegistry.registerPath({
  method: 'get',
  path: '/api/horario/',
  description: 'Obtener todos los horarios',
  summary: 'Obtener horarios',
  tags: ['Horarios'],
  responses: {
    200: {
      description: 'Horario encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Horario encontrado' }),
            data: getHorarioValidation,
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
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

// GET /api/horario/{usuario}
horarioRegistry.registerPath({
  method: 'get',
  path: '/api/horario/{usuario}',
  description: 'Obtener horarios por ID de usuario',
  summary: 'Obtener horarios por usuario',
  tags: ['Horarios'],
  request: {
    params: idUserParamValidation, // Cambiado a usuarioParamValidation
  },
  responses: {
    200: {
      description: 'Horarios encontrados',
      content: {
        'application/json': {
          schema: horarioSchema,
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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

// PUT /api/horario/{id}
horarioRegistry.registerPath({
  method: 'put',
  path: '/api/horario/{id}',
  description: 'Actualizar un horario existente',
  summary: 'Actualizar horario',
  tags: ['Horarios'],
  request: {
    params: idParamValidation,
    body: {
      description: 'Datos del horario a actualizar',
      content: {
        'application/json': {
          schema: idParamValidation,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Horario actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario actualizado exitosamente' }),
            data: updateHorarioValidation,
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
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

// DELETE /api/horario/{id}
horarioRegistry.registerPath({
  method: 'delete',
  path: '/api/horario/{id}',
  description: 'Eliminar un horario por ID',
  summary: 'Eliminar horario',
  tags: ['Horarios'],
  request: {
    params: idParamValidation,
  },
  responses: {
    200: {
      description: 'Horario eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario eliminado exitosamente' }),
            data: deleteHorarioValidation,
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
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
