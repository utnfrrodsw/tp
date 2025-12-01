import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  createServicioSchema,
  updateServicioSchema,
  upsertServicioSchema,
  servicioResponseSchema,
  servicioCompleteResponseSchema,
  findAllServiciosResponseSchema,
  findServiciosByUsuarioResponseSchema,
  upsertServicioResponseSchema,
  errorResponseSchema,
  successMessageSchema,
  idParamSchema,
  usuarioIdParamSchema,
  userTaskParamsSchema,
  servicioQuerySchema,
} from './servicio.schemas.js';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Create the servicioRegistry
export const servicioRegistry = new OpenAPIRegistry();

// Register schemas
servicioRegistry.register('CreateServicio', createServicioSchema);
servicioRegistry.register('UpdateServicio', updateServicioSchema);
servicioRegistry.register('UpsertServicio', upsertServicioSchema);
servicioRegistry.register('ServicioResponse', servicioResponseSchema);
servicioRegistry.register(
  'ServicioCompleteResponse',
  servicioCompleteResponseSchema
);
servicioRegistry.register(
  'FindAllServiciosResponse',
  findAllServiciosResponseSchema
);
servicioRegistry.register(
  'FindServiciosByUsuarioResponse',
  findServiciosByUsuarioResponseSchema
);
servicioRegistry.register(
  'UpsertServicioResponse',
  upsertServicioResponseSchema
);
servicioRegistry.register('ErrorResponse', errorResponseSchema);
servicioRegistry.register('SuccessMessage', successMessageSchema);
servicioRegistry.register('IdParam', idParamSchema);
servicioRegistry.register('UsuarioIdParam', usuarioIdParamSchema);
servicioRegistry.register('UserTaskParams', userTaskParamsSchema);
servicioRegistry.register('ServicioQuery', servicioQuerySchema);

// ==================== POST METHODS ====================

// POST /api/servicio
servicioRegistry.registerPath({
  method: 'post',
  path: '/api/servicio',
  description: 'Crear un nuevo servicio',
  summary: 'Crear servicio',
  tags: ['Servicios'],
  request: {
    body: {
      description: 'Datos del servicio a crear',
      content: {
        'application/json': {
          schema: createServicioSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Servicio creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'created service' }),
            data: servicioResponseSchema,
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

// POST /api/servicio/upsert
servicioRegistry.registerPath({
  method: 'post',
  path: '/api/servicio/upsert',
  description: 'Crear o actualizar servicio por usuario y tarea',
  summary: 'Crear o actualizar servicio',
  tags: ['Servicios'],
  request: {
    body: {
      description: 'Datos para crear o actualizar el servicio',
      content: {
        'application/json': {
          schema: upsertServicioSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Servicio actualizado exitosamente',
      content: {
        'application/json': {
          schema: upsertServicioResponseSchema,
        },
      },
    },
    201: {
      description: 'Servicio creado exitosamente',
      content: {
        'application/json': {
          schema: upsertServicioResponseSchema,
        },
      },
    },
    400: {
      description:
        'Error de validación - tareaId, usuarioId y precio (>0) son requeridos',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'tareaId, usuarioId y precio (>0) son requeridos',
            }),
          }),
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

// GET /api/servicio
servicioRegistry.registerPath({
  method: 'get',
  path: '/api/servicio',
  description: 'Obtener todos los servicios con sus relaciones',
  summary: 'Listar todos los servicios',
  tags: ['Servicios'],
  request: {
    query: servicioQuerySchema,
  },
  responses: {
    200: {
      description: 'Lista de servicios obtenida exitosamente',
      content: {
        'application/json': {
          schema: findAllServiciosResponseSchema,
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

// GET /api/servicio/{id}
servicioRegistry.registerPath({
  method: 'get',
  path: '/api/servicio/{id}',
  description: 'Obtener un servicio específico por ID con sus relaciones',
  summary: 'Obtener servicio por ID',
  tags: ['Servicios'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Servicio encontrado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found one service' }),
            data: servicioCompleteResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Servicio no encontrado',
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

// GET /api/servicio/user/{usuarioId}
servicioRegistry.registerPath({
  method: 'get',
  path: '/api/servicio/user/{usuarioId}',
  description: 'Obtener todos los servicios de un usuario específico',
  summary: 'Obtener servicios por usuario',
  tags: ['Servicios'],
  request: {
    params: usuarioIdParamSchema,
  },
  responses: {
    200: {
      description: 'Servicios del usuario encontrados exitosamente',
      content: {
        'application/json': {
          schema: findServiciosByUsuarioResponseSchema,
        },
      },
    },
    400: {
      description: 'usuarioId es requerido',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'usuarioId es requerido' }),
          }),
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

// PUT /api/servicio/{id}
servicioRegistry.registerPath({
  method: 'put',
  path: '/api/servicio/{id}',
  description: 'Actualizar información de un servicio',
  summary: 'Actualizar servicio',
  tags: ['Servicios'],
  request: {
    params: idParamSchema,
    body: {
      description: 'Datos del servicio a actualizar',
      content: {
        'application/json': {
          schema: updateServicioSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Servicio actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'updated service' }),
            data: servicioResponseSchema,
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
    404: {
      description: 'Servicio no encontrado',
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

// ==================== PATCH METHODS ====================

// PATCH /api/servicio/{id}
servicioRegistry.registerPath({
  method: 'patch',
  path: '/api/servicio/{id}',
  description: 'Actualizar parcialmente información de un servicio',
  summary: 'Actualizar servicio parcialmente',
  tags: ['Servicios'],
  request: {
    params: idParamSchema,
    body: {
      description: 'Datos del servicio a actualizar parcialmente',
      content: {
        'application/json': {
          schema: updateServicioSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Servicio actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'updated service' }),
            data: servicioResponseSchema,
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
    404: {
      description: 'Servicio no encontrado',
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

// PATCH /api/servicio/user/{usuarioId}/task/{tareaId}/deactivate
servicioRegistry.registerPath({
  method: 'patch',
  path: '/api/servicio/user/{usuarioId}/task/{tareaId}/deactivate',
  description:
    'Desactivar servicio por usuario y tarea (cambiar estado a inactivo)',
  summary: 'Desactivar servicio',
  tags: ['Servicios'],
  request: {
    params: userTaskParamsSchema,
  },
  responses: {
    200: {
      description: 'Servicio desactivado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'Servicio desactivado exitosamente',
            }),
            data: servicioResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'tareaId y usuarioId son requeridos',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'tareaId y usuarioId son requeridos',
            }),
          }),
        },
      },
    },
    404: {
      description: 'Servicio no encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Servicio no encontrado' }),
          }),
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

// DELETE /api/servicio/{id}
servicioRegistry.registerPath({
  method: 'delete',
  path: '/api/servicio/{id}',
  description: 'Eliminar un servicio',
  summary: 'Eliminar servicio',
  tags: ['Servicios'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Servicio eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'removed service' }),
            data: servicioResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Servicio no encontrado',
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

// DELETE /api/servicio/user/{usuarioId}/task/{tareaId}
servicioRegistry.registerPath({
  method: 'delete',
  path: '/api/servicio/user/{usuarioId}/task/{tareaId}',
  description: 'Eliminar servicio por usuario y tarea',
  summary: 'Eliminar servicio por usuario y tarea',
  tags: ['Servicios'],
  request: {
    params: userTaskParamsSchema,
  },
  responses: {
    200: {
      description: 'Servicio eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'Servicio eliminado exitosamente',
            }),
          }),
        },
      },
    },
    400: {
      description: 'tareaId y usuarioId son requeridos',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'tareaId y usuarioId son requeridos',
            }),
          }),
        },
      },
    },
    404: {
      description: 'Servicio no encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Servicio no encontrado' }),
          }),
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
