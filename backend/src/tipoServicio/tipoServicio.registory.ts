import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createTipoServicioSchema,
  updateTipoServicioSchema,
  deleteTipoServicioSchema,
  errorResponseSchema,
  getTipoServicioSchema,
  tipoServicioSchemaBase,
} from './tipoServicio.schemas.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const tipoServicioRegistry = new OpenAPIRegistry();

tipoServicioRegistry.register('CreateTipoServicio', createTipoServicioSchema);
tipoServicioRegistry.register('UpdateTipoServicio', updateTipoServicioSchema);
tipoServicioRegistry.register('DeleteTipoServicio', deleteTipoServicioSchema);
tipoServicioRegistry.register('GetTipoServicio', getTipoServicioSchema);

// ===================================================================================================================
// ========================================== Metodos de post =========================================
// ===================================================================================================================
tipoServicioRegistry.registerPath({
  method: 'post',
  path: '/serviceTypes',
  description: 'Crear un nuevo tipo de servicio (con o sin tareas/usuarios)',
  summary: 'Crear tipo de servicio',
  tags: ['TipoServicio'],
  request: {
    body: {
      description: 'Datos del tipo de servicio a crear',
      content: {
        'application/json': {
          schema: tipoServicioSchemaBase,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Tipo de servicio creado exitosamente',
      content: {
        'application/json': {
          schema: createTipoServicioSchema,
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
  },
});
// ===================================================================================================================
// ========================================== Metodos de put =========================================
// ===================================================================================================================
tipoServicioRegistry.registerPath({
  method: 'put',
  path: '/serviceTypes/{id}',
  description: 'Actualizar un tipo de servicio existente',
  summary: 'Actualizar tipo de servicio',
  tags: ['TipoServicio'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'ID del tipo de servicio a actualizar',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  request: {
    body: {
      description: 'Datos del tipo de servicio a actualizar',
      content: {
        'application/json': {
          schema: updateTipoServicioSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Tipo de servicio actualizado exitosamente',
      content: {
        'application/json': {
          schema: updateTipoServicioSchema,
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
  },
});
// ===================================================================================================================
// ========================================== Metodos de delete =========================================
// ===================================================================================================================
tipoServicioRegistry.registerPath({
  method: 'delete',
  path: '/serviceTypes/{id}',
  description: 'Eliminar un tipo de servicio por ID',
  summary: 'Eliminar tipo de servicio',
  tags: ['TipoServicio'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'ID del tipo de servicio a eliminar',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  responses: {
    204: {
      description: 'Tipo de servicio eliminado exitosamente',
    },
    404: {
      description: 'Tipo de servicio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
// ===================================================================================================================
// ========================================== Metodos de get =========================================
// ===================================================================================================================
tipoServicioRegistry.registerPath({
  method: 'get',
  path: '/serviceTypes/',
  description: 'Obtener todos los tipos de servicio',
  summary: 'Obtener tipo de servicio',
  tags: ['TipoServicio'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'ID del tipo de servicio a obtener',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  responses: {
    200: {
      description: 'Tipo de servicio obtenido exitosamente',
      content: {
        'application/json': {
          schema: getTipoServicioSchema,
        },
      },
    },
    404: {
      description: 'Tipo de servicio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
tipoServicioRegistry.registerPath({
  method: 'get',
  path: '/serviceTypes/{id}',
  description: 'Obtener un tipo de servicio por ID',
  summary: 'Obtener tipo de servicio',
  tags: ['TipoServicio'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'ID del tipo de servicio a obtener',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  responses: {
    200: {
      description: 'Tipo de servicio obtenido exitosamente',
      content: {
        'application/json': {
          schema: getTipoServicioSchema,
        },
      },
    },
    404: {
      description: 'Tipo de servicio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
tipoServicioRegistry.registerPath({
  method: 'get',
  path: '/serviceTypes/with-tareas/',
  description: 'Obtener todos los tipos de servicio con tareas',
  summary: 'Obtener tipo de servicio',
  tags: ['TipoServicio'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      description: 'ID del tipo de servicio a obtener',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  responses: {
    200: {
      description: 'Tipo de servicio obtenido exitosamente',
      content: {
        'application/json': {
          schema: getTipoServicioSchema,
        },
      },
    },
    404: {
      description: 'Tipo de servicio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
