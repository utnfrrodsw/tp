import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createTareaValidation,
  updateTareaValidation,
  tareaBaseSchema,
  tareaBaseSchemaWithTipoServicioId,
  idParamValidation,
  deleteTareaValidation,
  getTareaValidation,
  errorResponseSchema,
} from './tarea.schemas.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// Crear el tareaRegistry
export const tareaRegistry = new OpenAPIRegistry();

// Registrar esquemas
tareaRegistry.register('CreateTarea', createTareaValidation);
tareaRegistry.register('UpdateTarea', updateTareaValidation);
tareaRegistry.register('DeleteTarea', deleteTareaValidation);
tareaRegistry.register('Tarea', getTareaValidation);
tareaRegistry.register('IdParam', idParamValidation);
tareaRegistry.register('ErrorResponse', errorResponseSchema);

// ==================== POST METHODS ====================

// POST /api/tarea
tareaRegistry.registerPath({
  method: 'post',
  path: '/api/tarea',
  description: 'Crear una nueva tarea',
  summary: 'Crear tarea',
  tags: ['Tareas'],
  request: {
    body: {
      description: 'Datos de la tarea a crear',
      content: {
        'application/json': {
          schema: tareaBaseSchemaWithTipoServicioId,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Tarea creada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Tarea creada exitosamente' }),
            data: createTareaValidation,
          }),
        },
      },
    },
    400: {
      description: 'Solicitud incorrecta',
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

// GET /api/tarea/{id}
tareaRegistry.registerPath({
  method: 'get',
  path: '/api/tarea/{id}',
  description: 'Obtener una tarea por ID',
  summary: 'Obtener tarea',
  tags: ['Tareas'],
  request: {
    params: idParamValidation,
  },
  responses: {
    200: {
      description: 'Tarea encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Tarea encontrada' }),
            data: getTareaValidation,
          }),
        },
      },
    },
    404: {
      description: 'Tarea no encontrada',
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

// GET /api/tarea/
tareaRegistry.registerPath({
  method: 'get',
  path: '/api/tarea/',
  description: 'Obtener todas las tareas',
  summary: 'Obtener tareas',
  tags: ['Tareas'],
  responses: {
    200: {
      description: 'Lista de tareas obtenida exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Tareas encontradas' }),
            data: z.array(getTareaValidation),
          }),
        },
      },
    },
    404: {
      description: 'Tareas no encontradas',
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

// PUT /api/tarea/{id}
tareaRegistry.registerPath({
  method: 'put',
  path: '/api/tarea/{id}',
  description: 'Actualizar una tarea existente',
  summary: 'Actualizar tarea',
  tags: ['Tareas'],
  request: {
    params: idParamValidation,
    body: {
      description: 'Datos de la tarea a actualizar',
      content: {
        'application/json': {
          schema: updateTareaValidation,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Tarea actualizada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Tarea actualizada exitosamente' }),
            data: updateTareaValidation,
          }),
        },
      },
    },
    404: {
      description: 'Tarea no encontrada',
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

// DELETE /api/tarea/{id}
tareaRegistry.registerPath({
  method: 'delete',
  path: '/api/tarea/{id}',
  description: 'Eliminar una tarea por ID',
  summary: 'Eliminar tarea',
  tags: ['Tareas'],
  request: {
    params: idParamValidation,
  },
  responses: {
    200: {
      description: 'Tarea eliminada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Tarea eliminada exitosamente' }),
            data: deleteTareaValidation,
          }),
        },
      },
    },
    404: {
      description: 'Tarea no encontrada',
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
