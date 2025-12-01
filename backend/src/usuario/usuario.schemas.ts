import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const usuarioBaseSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .describe('Nombre del usuario')
    .openapi({
      example: 'Juan',
    }),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El apellido solo puede contener letras y espacios'
    )
    .describe('Apellido del usuario')
    .openapi({
      example: 'Pérez',
    }),
  mail: z
    .string()
    .email('El email debe tener un formato válido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .describe('Correo electrónico del usuario')
    .openapi({
      example: 'juan.perez@gmail.com',
    }),
  tipoDoc: z
    .enum(['DNI', 'CUIT', 'CUIL'], {
      message: 'Tipo de documento debe ser DNI, CUIT o CUIL',
    })
    .describe('Tipo de documento')
    .openapi({
      example: 'DNI',
    }),
  numeroDoc: z
    .string()
    .min(7, 'Número de documento debe tener al menos 7 caracteres')
    .max(13, 'Número de documento no puede exceder 13 caracteres')
    .regex(
      /^[0-9\-]+$/,
      'Número de documento solo puede contener números y guiones'
    )
    .describe('Número de documento')
    .openapi({
      example: '12345678',
    }),
  telefono: z
    .string()
    .min(8, 'El número de teléfono debe tener entre 8 y 12 dígitos')
    .max(12, 'El número de teléfono debe tener entre 8 y 12 dígitos')
    .regex(
      /^[1-9][0-9]{7,11}$/,
      'El número de teléfono debe tener entre 8 y 12 dígitos, no puede empezar con 0'
    )
    .describe('Número de teléfono')
    .openapi({
      example: '+54 11 1234-5678',
    }),
  direccion: z
    .string()
    .min(5, 'Dirección debe ser más específica')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .describe('Dirección del usuario')
    .openapi({
      example: 'Av. Corrientes 1234',
    }),
  contrasena: z
    .string()
    .min(
      6,
      'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número'
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
    ),
  foto: z
    .string()
    .url('La foto debe ser una URL válida')
    .max(200, 'La URL de la foto no puede exceder los 200 caracteres')
    .optional()
    .describe('URL de la foto de perfil del usuario')
    .openapi({
      example: 'http://example.com/foto.jpg',
    }),
  estado: z
    .enum(['activo', 'inactivo'], {
      message: 'El estado debe ser "activo" o "inactivo"',
    })
    .default('activo')
    .describe('Estado del usuario')
    .openapi({
      example: 'activo',
    }),
});

export const createUsuarioSchema = usuarioBaseSchema.extend({
  //Campos obligatorios
  mail: usuarioBaseSchema.shape.mail,
  nombre: usuarioBaseSchema.shape.nombre,
  apellido: usuarioBaseSchema.shape.apellido,
  tipoDoc: usuarioBaseSchema.shape.tipoDoc,
  numeroDoc: usuarioBaseSchema.shape.numeroDoc,
  telefono: usuarioBaseSchema.shape.telefono,
  direccion: usuarioBaseSchema.shape.direccion,
  estado: usuarioBaseSchema.shape.estado,
  contrasena: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .describe('Contraseña del usuario')
    .openapi({
      example: 'Password123',
    }),
  //Campos opcionales
  nombreFantasia: z
    .string()
    .min(2, 'El nombre de fantasía debe tener al menos 2 caracteres')
    .max(30, 'El nombre de fantasía no puede exceder los 30 caracteres')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Servicios SRL',
    }),

  descripcion: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(300, 'La descripción no puede exceder los 300 caracteres')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Descripción del prestatario')
    .openapi({
      example: 'Ofrecemos servicios de plomería y electricidad.',
    }),
});

export const loginSchema = z.object({
  mail: z
    .string()
    .email('El email debe tener un formato válido')
    .describe('Correo electrónico del usuario')
    .openapi({
      example: 'juan.perez@gmail.com',
    }),
  contrasena: z.string().describe('Contraseña del usuario').openapi({
    example: 'Password123',
  }),
});

export const findPrestatariosByTipoServicioAndZonaParamsSchema = z.object({
  tipoServicio: z
    .string()
    .describe('Tipo de servicio a filtrar ("Todos" para no filtrar)')
    .openapi({
      example: 'Plomería',
    }),
  zona: z
    .string()
    .describe('Zona a filtrar ("Todas" para no filtrar)')
    .openapi({
      example: 'Centro',
    }),
  tarea: z
    .string()
    .optional()
    .describe('Tarea específica a filtrar (opcional)')
    .openapi({
      example: 'Reparación de canillas',
    }),
  orderBy: z
    .enum(['nombre', 'calificacion'])
    .optional()
    .describe('Campo por el cual ordenar los resultados')
    .openapi({
      example: 'calificacion',
    }),
});

export const findPrestatariosByTipoServicioAndZonaQuerySchema = z.object({
  maxItems: z.coerce
    .number()
    .min(1)
    .max(50)
    .default(6)
    .describe('Número máximo de elementos por página')
    .openapi({
      example: 6,
    }),
  page: z.coerce
    .number()
    .min(1)
    .default(1)
    .describe('Número de página')
    .openapi({
      example: 1,
    }),
});

export const tareaSchema = z.object({
  id: z.number().describe('ID de la tarea').openapi({
    example: 1,
  }),
  nombreTarea: z.string().describe('Nombre de la tarea').openapi({
    example: 'Reparación de canillas',
  }),
  descripcionTarea: z.string().describe('Descripción de la tarea').openapi({
    example: 'Arreglo de grifería',
  }),
  duracionTarea: z
    .number()
    .describe('Duración de la tarea en minutos')
    .openapi({
      example: 60,
    }),
  tipoServicio: z.number().describe('ID del tipo de servicio').openapi({
    example: 2,
  }),
});

export const servicioSchema = z.object({
  id: z.number().describe('ID del servicio').openapi({
    example: 1,
  }),
  descripcionServicio: z
    .string()
    .optional()
    .describe('Descripción del servicio')
    .openapi({
      example: 'Servicio de plomería profesional',
    }),
  precio: z.number().describe('Precio del servicio').openapi({
    example: 2500.0,
  }),
  estado: z.string().describe('Estado del servicio').openapi({
    example: 'activo',
  }),
  tarea: tareaSchema.describe('Tarea asociada al servicio'),
});

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

export const horarioSchema = z.object({
  id: z.number().describe('ID del horario').openapi({
    example: 1,
  }),
  diaSemana: z.string().describe('Día de la semana').openapi({
    example: 'Lunes',
  }),
  horaInicio: z.string().describe('Hora de inicio').openapi({
    example: '09:00',
  }),
  horaFin: z.string().describe('Hora de fin').openapi({
    example: '17:00',
  }),
});

export const turnoSchema = z.object({
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
  calificacion: z
    .number()
    .nullable()
    .describe('Calificación del turno (1-5)')
    .openapi({
      example: 4.5,
    }),
  comentario: z.string().nullable().describe('Comentario del cliente').openapi({
    example: 'Excelente servicio',
  }),
});

export const usuarioCompleteResponseSchema = z.object({
  id: z.number().describe('ID único del usuario').openapi({ example: 1 }),
  mail: z.string().describe('Email del usuario').openapi({
    example: 'usuario@example.com',
  }),
  nombre: z.string().describe('Nombre del usuario').openapi({
    example: 'Juan',
  }),
  apellido: z.string().describe('Apellido del usuario').openapi({
    example: 'Pérez',
  }),
  tipoDoc: z.string().describe('Tipo de documento').openapi({
    example: 'DNI',
  }),
  numeroDoc: z.string().describe('Número de documento').openapi({
    example: '12345678',
  }),
  telefono: z.string().describe('Teléfono').openapi({
    example: '+54 11 1234-5678',
  }),
  direccion: z.string().describe('Dirección').openapi({
    example: 'Av. Corrientes 1234',
  }),
  nombreFantasia: z.string().nullable().describe('Nombre de fantasía').openapi({
    example: 'Plomería Pérez',
  }),
  descripcion: z.string().nullable().describe('Descripción').openapi({
    example: 'Plomero con experiencia',
  }),
  foto: z.string().nullable().describe('URL de la foto de perfil').openapi({
    example: 'http://localhost:3000/uploads/profiles/optimized_1.webp',
  }),
  estado: z.string().describe('Estado del usuario').openapi({
    example: 'activo',
  }),
  turnos: z.array(turnoSchema).describe('Turnos asociados al usuario'),
  servicios: z
    .array(servicioSchema)
    .describe('Servicios ofrecidos por el usuario'),
  tiposDeServicio: z
    .array(tipoServicioSchema)
    .describe('Tipos de servicio que ofrece el usuario'),
  horarios: z
    .array(horarioSchema)
    .describe('Horarios de disponibilidad del usuario'),
});

export const findAllUsuariosResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'Usuarios encontrados',
  }),
  data: z
    .array(usuarioCompleteResponseSchema)
    .describe('Lista completa de usuarios con todas sus relaciones'),
});

export const tareaInfoSchema = z.object({
  nombreTarea: z.string().describe('Nombre de la tarea').openapi({
    example: 'Reparación de canillas',
  }),
});

export const tipoServicioInfoSchema = z.object({
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

export const zonaInfoSchema = z.object({
  id: z.number().describe('ID de la zona').openapi({
    example: 1,
  }),
  descripcion_zona: z.string().describe('Descripción de la zona').openapi({
    example: 'Centro',
  }),
});

export const prestatarioWithRatingSchema = z.object({
  id: z.number().describe('ID único del prestatario').openapi({
    example: 1,
  }),
  nombre: z.string().describe('Nombre del prestatario').openapi({
    example: 'Juan',
  }),
  apellido: z.string().describe('Apellido del prestatario').openapi({
    example: 'Pérez',
  }),
  nombreFantasia: z
    .string()
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Plomería Pérez',
    }),
  descripcion: z
    .string()
    .nullable()
    .describe('Descripción del prestatario')
    .openapi({
      example: 'Plomero con más de 10 años de experiencia',
    }),
  foto: z.string().nullable().describe('URL de la foto de perfil').openapi({
    example: 'http://localhost:3000/uploads/profiles/optimized_1.webp',
  }),
  tiposDeServicio: z
    .array(tipoServicioInfoSchema)
    .describe('Tipos de servicio que ofrece el prestatario'),
  tareas: z
    .array(tareaInfoSchema)
    .describe('Tareas específicas que puede realizar'),
  calificacion: z
    .number()
    .min(0)
    .max(5)
    .describe('Calificación promedio del prestatario (0-5)')
    .openapi({
      example: 4.5,
    }),
});

export const paginationInfoSchema = z.object({
  page: z.number().describe('Página actual').openapi({
    example: 1,
  }),
  maxItems: z.number().describe('Elementos por página').openapi({
    example: 6,
  }),
  totalPages: z.number().describe('Total de páginas disponibles').openapi({
    example: 5,
  }),
});

export const findPrestatariosByTipoServicioAndZonaResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found prestatarios',
  }),
  data: z
    .array(prestatarioWithRatingSchema)
    .describe('Lista de prestatarios encontrados'),
  pagination: paginationInfoSchema.describe('Información de paginación'),
});

export const notFoundResponseSchema = z.object({
  message: z
    .string()
    .describe('Mensaje de error cuando no se encuentran prestatarios')
    .openapi({
      example: 'No prestatarios found for the given tipoServicio and zona',
    }),
});

export const usuarioResponseSchema = z.object({
  id: z.number().describe('ID único del usuario').openapi({ example: 1 }),
  mail: z.string().describe('Email del usuario').openapi({
    example: 'usuario@example.com',
  }),
  nombre: z
    .string()
    .describe('Nombre del usuario')
    .openapi({ example: 'Juan' }),
  apellido: z
    .string()
    .describe('Apellido del usuario')
    .openapi({ example: 'Pérez' }),
  tipoDoc: z.string().describe('Tipo de documento').openapi({ example: 'DNI' }),
  numeroDoc: z
    .string()
    .describe('Número de documento')
    .openapi({ example: '12345678' }),
  telefono: z
    .string()
    .describe('Teléfono')
    .openapi({ example: '+54 11 1234-5678' }),
  direccion: z
    .string()
    .describe('Dirección')
    .openapi({ example: 'Av. Corrientes 1234' }),
  nombreFantasia: z.string().nullable().describe('Nombre de fantasía').openapi({
    example: 'Plomerín',
  }),
  descripcion: z.string().nullable().describe('Descripción').openapi({
    example: 'Servicio de plomería con experiencia',
  }),
});

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'Turno no encontrado',
  }),
  errors: z
    .array(
      z.object({
        field: z
          .string()
          .describe('Campo que falló')
          .openapi({ example: 'email' }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'Email inválido',
        }),
      })
    )
    .optional()
    .describe('Detalles de errores de validación'),
});

//! Exporto los esquemas para usar en el middleware de validación

export const createUsuarioValidation = createUsuarioSchema;
export const updateUsuarioValidation = createUsuarioSchema.partial();
export const loginValidation = loginSchema;

export const recuperarContrasenaValidation = z.object({
  mail: z.string().email('Email inválido'),
});

export const validarCodigoValidation = z.object({
  mail: z.string().email('Email inválido'),
  codigo: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
});

export const cambiarPasswordValidation = z.object({
  mail: z.string().email('Email inválido'),
  codigo: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
  nuevaContrasena: z
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

// Params validations
export const idParamValidation = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número válido'),
});

export const userIdParamValidation = z.object({
  userId: z.string().regex(/^\d+$/, 'User ID debe ser un número válido'),
});

export const paginationQueryValidation = z.object({
  maxItems: z.coerce.number().min(1).max(50).default(5),
  page: z.coerce.number().min(1).default(1),
  orderBy: z.string().optional(),
});
