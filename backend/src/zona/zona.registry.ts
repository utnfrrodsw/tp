import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  createZonaSchema,
  updateZonaSchema,
  zonaResponseSchema,
  zonaCompleteResponseSchema,
  findAllZonasResponseSchema,
  findAllZonasSimpleResponseSchema,
  errorResponseSchema,
  successMessageSchema,
  idParamSchema,
  findAllZonasConUsuariosResponseSchema,
  updateByUserValidation,
} from './zona.schemas.js';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Create the zonaRegistry
export const zonaRegistry = new OpenAPIRegistry();

// Register schemas
zonaRegistry.register('CreateZona', createZonaSchema);
zonaRegistry.register('UpdateZona', updateZonaSchema);
zonaRegistry.register('ZonaResponse', zonaResponseSchema);
zonaRegistry.register('ZonaCompleteResponse', zonaCompleteResponseSchema);
zonaRegistry.register('FindAllZonasResponse', findAllZonasResponseSchema);
zonaRegistry.register(
  'FindAllZonasSimpleResponse',
  findAllZonasSimpleResponseSchema
);
zonaRegistry.register('ErrorResponse', errorResponseSchema);
zonaRegistry.register('SuccessMessage', successMessageSchema);
zonaRegistry.register('IdParam', idParamSchema);
zonaRegistry.register(
  'FindAllZonasConUsuariosResponse',
  findAllZonasConUsuariosResponseSchema
);
zonaRegistry.register('UpdateByUserValidation', updateByUserValidation);
// ==================== POST METHODS ====================

// POST /api/zona
zonaRegistry.registerPath({
  method: 'post',
  path: '/api/zona',
  description: 'Crear una nueva zona',
  summary: 'Crear zona',
  tags: ['Zonas'],
  request: {
    body: {
      description: 'Datos de la zona a crear',
      content: {
        'application/json': {
          schema: createZonaSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Zona creada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Zona creada exitosamente' }),
            data: zonaResponseSchema,
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
    409: {
      description: 'Conflicto - la zona ya existe',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'ZONA_ALREADY_EXISTS' }),
            message: z.string().openapi({
              example: 'Ya existe una zona con esa descripción',
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

// GET /api/zona
zonaRegistry.registerPath({
  method: 'get',
  path: '/api/zona',
  description: 'Obtener todas las zonas con sus usuarios asociados',
  summary: 'Listar todas las zonas completas',
  tags: ['Zonas'],
  request: {},
  responses: {
    200: {
      description:
        'Lista de zonas con usuarios asociados obtenida exitosamente',
      content: {
        'application/json': {
          schema: findAllZonasResponseSchema,
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

zonaRegistry.registerPath({
  method: 'get',
  path: '/api/zona/usuario',
  description: 'Obtener todas las zonas con sus usuarios asociados',
  summary: 'Listar todas las zonas completas',
  tags: ['Zonas'],
  request: {},
  responses: {
    200: {
      description:
        'Lista de zonas con usuarios asociados obtenida exitosamente',
      content: {
        'application/json': {
          schema: findAllZonasConUsuariosResponseSchema,
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
// GET /api/zona/simple
zonaRegistry.registerPath({
  method: 'get',
  path: '/api/zona/simple',
  description: 'Obtener todas las zonas sin relaciones (versión simple)',
  summary: 'Listar zonas simples',
  tags: ['Zonas'],
  request: {},
  responses: {
    200: {
      description: 'Lista simple de zonas obtenida exitosamente',
      content: {
        'application/json': {
          schema: findAllZonasSimpleResponseSchema,
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

// GET /api/zona/{id}
zonaRegistry.registerPath({
  method: 'get',
  path: '/api/zona/{id}',
  description: 'Obtener una zona específica por ID con sus usuarios asociados',
  summary: 'Obtener zona por ID',
  tags: ['Zonas'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Zona encontrada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found one zona' }),
            data: zonaCompleteResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Zona no encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Zona no encontrada' }),
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

// PUT /api/zona/{id}
zonaRegistry.registerPath({
  method: 'put',
  path: '/api/zona/{id}',
  description: 'Actualizar información de una zona',
  summary: 'Actualizar zona',
  tags: ['Zonas'],
  request: {
    params: idParamSchema,
    body: {
      description: 'Datos de la zona a actualizar',
      content: {
        'application/json': {
          schema: updateZonaSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Zona actualizada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'updated zona' }),
            data: zonaResponseSchema,
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
      description: 'Zona no encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Zona no encontrada' }),
          }),
        },
      },
    },
    409: {
      description: 'Conflicto - descripción ya existe',
      content: {
        'application/json': {
          schema: z.object({
            error: z
              .string()
              .openapi({ example: 'DESCRIPCION_ALREADY_EXISTS' }),
            message: z.string().openapi({
              example: 'Ya existe una zona con esa descripción',
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

zonaRegistry.registerPath({
  method: 'put',
  path: '/api/zona/updateByUser/{id}',
  description: 'Poner o quitar la zona al usuario autenticado',
  summary: 'Actualizar zona',
  tags: ['Zonas'],
  request: {
    params: idParamSchema,
    body: {
      description: 'Datos de la zona a actualizar',
      content: {
        'application/json': {
          schema: updateByUserValidation,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Zona actualizada exitosamente',
      content: {
        'application/json': {
          // Ajusto el schema para reflejar id + descripcionZona + selected
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Zona agregada al usuario' }),
            data: findAllZonasConUsuariosResponseSchema,
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
      description: 'Zona no encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Zona no encontrada' }),
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

// DELETE /api/zona/{id}
zonaRegistry.registerPath({
  method: 'delete',
  path: '/api/zona/{id}',
  description: 'Eliminar una zona',
  summary: 'Eliminar zona',
  tags: ['Zonas'],
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Zona eliminada exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'deleted zona' }),
            data: zonaResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Zona no encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Zona no encontrada' }),
          }),
        },
      },
    },
    409: {
      description: 'Conflicto - la zona tiene usuarios asociados',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'ZONA_HAS_USERS' }),
            message: z.string().openapi({
              example:
                'No se puede eliminar la zona porque tiene usuarios asociados',
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
