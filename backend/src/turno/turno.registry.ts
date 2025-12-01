import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  TurnoSchema,
  TurnoCreateSchema,
  TurnoUpdateSchema,
  TurnoIdSchema,
  TurnoQuerySchema,
  fullTurnoSchema,
  errorResponseSchema,
  turnoQuerySchemaDash,
  // Nuevo import
} from './turno.schemas.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// Crear el turnoRegistry
export const turnoRegistry = new OpenAPIRegistry();

// Registrar esquemas
turnoRegistry.register('Turno', TurnoSchema);
turnoRegistry.register('TurnoCreate', TurnoCreateSchema);
turnoRegistry.register('TurnoUpdate', TurnoUpdateSchema);
turnoRegistry.register('TurnoId', TurnoIdSchema);
turnoRegistry.register('TurnoQuery', TurnoQuerySchema);
turnoRegistry.register('FullTurno', fullTurnoSchema);
turnoRegistry.register('ErrorResponse', errorResponseSchema);

// ==================== GET METHODS ====================

// GET /api/turno
turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno',
  description: 'Obtener todos los turnos',
  summary: 'Listar turnos',
  tags: ['Turnos'],
  responses: {
    200: {
      description: 'Lista de turnos obtenida exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found all turns' }),
            data: z.array(fullTurnoSchema),
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

// GET /api/turno/{id}
turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno/{id}',
  description: 'Obtener un turno por ID',
  summary: 'Obtener turno',
  tags: ['Turnos'],
  request: {
    params: TurnoIdSchema,
  },
  responses: {
    200: {
      description: 'Turno encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found turn' }),
            data: fullTurnoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
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

turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno/byPrestador/{id}',
  description:
    'Obtener turnos por ID del prestador. La ruta acepta parámetros adicionales opcionales en el path.',
  summary: 'Obtener turnos por prestador',
  tags: ['Turnos'],
  request: {
    params: turnoQuerySchemaDash,
  },
  responses: {
    200: {
      description: 'Turnos encontrados',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'found turns by prestador id' }),
            data: z.array(fullTurnoSchema),
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
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

turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno/byPrestador/{id}',
  description:
    'Obtener turnos por ID del prestador. La ruta acepta parámetros adicionales opcionales en el path.',
  summary: 'Obtener turnos por prestador',
  tags: ['Turnos'],
  request: {
    params: turnoQuerySchemaDash,
  },
  responses: {
    200: {
      description: 'Turnos encontrados',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'found turns by prestador id' }),
            data: z.array(fullTurnoSchema),
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
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

// ==================== POST METHODS ====================

// POST /api/turno
turnoRegistry.registerPath({
  method: 'post',
  path: '/api/turno',
  description: 'Crear un nuevo turno',
  summary: 'Crear turno',
  tags: ['Turnos'],
  request: {
    body: {
      description: 'Datos del turno a crear',
      content: {
        'application/json': {
          schema: TurnoCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Turno creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Turno creado exitosamente' }),
            data: fullTurnoSchema,
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

// ==================== PATCH METHODS ====================

// PATCH /api/turno/{id}
turnoRegistry.registerPath({
  method: 'patch',
  path: '/api/turno/{id}',
  description: 'Actualizar parcialmente un turno',
  summary: 'Actualizar turno',
  tags: ['Turnos'],
  request: {
    params: TurnoIdSchema,
    body: {
      description: 'Datos del turno a actualizar',
      content: {
        'application/json': {
          schema: TurnoUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Turno actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Turn updated successfully' }),
            data: fullTurnoSchema,
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
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

// DELETE /api/turno/{id}
turnoRegistry.registerPath({
  method: 'delete',
  path: '/api/turno/{id}',
  description: 'Eliminar un turno por ID',
  summary: 'Eliminar turno',
  tags: ['Turnos'],
  request: {
    params: TurnoIdSchema,
  },
  responses: {
    200: {
      description: 'Turno eliminado exitosamente',
      content: {
        'application/json': {
          schema: fullTurnoSchema,
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
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
