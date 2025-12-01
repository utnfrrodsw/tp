// turno.schemas.ts
// Esquemas de validación para Turno, similar a usuario.schemas.ts y zona.schemas.ts

import { array, z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

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
// ===================================================================================================================
// ========================================== schema de servicio  =========================================
// ===================================================================================================================
export const servicioSchema = z.object({
  id: z.string().describe('ID del servicio').openapi({
    example: '1', // Cambiado de 1 a '1'
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
  servicio: z
    .number()
    .int()
    .positive('El ID de la servicio debe ser un número entero positivo')
    .describe('ID de la servicio asociada al servicio')
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
// ========================================== schema de pago basico =========================================
// ===================================================================================================================
export const pagoSchema = z.object({
  paymentIntentId: z
    .string()
    .min(1, 'El paymentIntentId es obligatorio')
    .describe('ID del pago en Stripe')
    .openapi({ example: 'pi_1JXXXXXX' }),

  amount: z
    .number()
    .min(
      350,
      'El monto debe ser mayor o igual a 3.50 centavos (3.50 en moneda)'
    )
    .describe('Monto del pago en centavos')
    .openapi({ example: 1000 }),

  currency: z
    .string()
    .length(3, 'La moneda debe ser un código ISO de 3 letras')
    .describe('Moneda del pago en formato ISO (ej: usd, ars)')
    .openapi({ example: 'usd' }),

  estado: z
    .enum([
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'succeeded',
      'requires_capture',
      'canceled',
    ])
    .describe('Estado del pago en Stripe')
    .openapi({ example: 'succeeded' }),

  sellerStripeId: z
    .string()
    .min(1, 'El ID del vendedor es obligatorio')
    .describe('ID del vendedor de la cuenta de Stripe')
    .openapi({ example: 'acct_1JXXXXXX' }),

  amountReceived: z
    .number()
    .min(0, 'El monto recibido no puede ser negativo')
    .describe('Monto recibido por el vendedor en centavos')
    .openapi({ example: 950 }),

  applicationFeeAmount: z
    .number()
    .min(0, 'La comisión de la plataforma no puede ser negativa')
    .optional()
    .describe('Comisión de la plataforma en centavos')
    .openapi({ example: 50 }),

  transferId: z
    .string()
    .optional()
    .describe('ID de la transferencia a la cuenta del vendedor en Stripe')
    .openapi({ example: 'tr_1JXXXXXX' }),

  buyerEmail: z
    .string()
    .email('El correo electrónico no es válido')
    .optional()
    .describe('Correo electrónico del comprador')
    .openapi({ example: 'buyer@example.com' }),

  metadata: z
    .record(z.string(), z.any())
    .optional()
    .describe('Datos adicionales como productId, orderId')
    .openapi({ example: { productId: 'prod_123', orderId: 'ord_456' } }),
  createdAt: z
    .string()
    .datetime()
    .describe('Fecha de creación del pago en formato ISO')
    .openapi({ example: '2023-10-01T12:34:56Z' }),

  updatedAt: z
    .string()
    .datetime()
    .describe('Fecha de última actualización del pago en formato ISO')
    .openapi({ example: '2023-10-01T12:34:56Z' }),
});
// ===================================================================================================================
// ========================================== schema de turno basico =========================================
// ===================================================================================================================

export const TurnoSchema = z.object({
  fechaHora: z
    .string()
    .describe('Fecha y hora del turno')
    .openapi({ example: '2025-09-30T14:00:00Z' }),
  montoFinal: z
    .number()
    .positive('El monto final debe ser un número positivo')
    .describe('Monto final del turno')
    .openapi({ example: 15000 }),
  estado: z
    .string()
    .describe('Estado del turno')
    .openapi({ example: 'Pendiente' }),
  calificacion: z
    .number()
    .min(1, 'La calificación debe ser al menos 1')
    .max(5, 'La calificación no puede ser mayor a 5')
    .optional()
    .describe('Calificación del turno')
    .openapi({ example: 4 }),
  comentario: z
    .string()
    .min(20, 'El comentario debe tener al menos 20 caracteres')
    .max(500, 'El comentario no puede exceder los 500 caracteres')
    .optional()
    .describe('Comentario del turno')
    .openapi({ example: 'El servicio fue excelente y puntual.' }),
});

// ===================================================================================================================
// ========================================== schema de turno creat =========================================
// ===================================================================================================================
export const TurnoCreateSchema = TurnoSchema.extend({
  servicio: z
    .number()
    .int()
    .positive('El ID del servicio debe ser un número entero positivo')
    .describe('ID del servicio')
    .openapi({ example: 1 }),
});

// ===================================================================================================================
// ========================================== schema de turno update =========================================
// ===================================================================================================================

export const TurnoUpdateSchema = TurnoSchema.extend({
  usuarioId: z.number().describe('ID del usuario').openapi({ example: 2 }),
  servicio: z.number().describe('ID del servicio').openapi({ example: 1 }),
  pago: z.number().describe('ID de la zona').openapi({ example: 3 }),
}).partial();

// ===================================================================================================================
// ========================================== validate id  =========================================
// ===================================================================================================================

export const TurnoIdSchema = z.object({
  id: z.string().describe('ID del turno').openapi({
    example: '1', // Cambiado de 1 a '1'
  }),
});

// ===================================================================================================================
// ========================================== validate full schema =========================================
// ===================================================================================================================

export const fullTurnoSchema = TurnoSchema.extend({
  usuarioid: usuarioInfoSchema,
  id: z.number().describe('ID del turno').openapi({ example: 1 }),
  servicio: servicioSchema,
  pago: array(pagoSchema).optional(),
});

export const turnoQuerySchemaDash = z.object({
  id: z.string().describe('ID del prestatario').openapi({
    example: '52',
  }),
  cantItemsPerPage: z
    .string()
    .optional()
    .describe('Cantidad de items por página')
    .openapi({ example: '10' }),
  currentPage: z
    .string()
    .optional()
    .describe('Página actual')
    .openapi({ example: '1' }),
  selectedValueShow: z
    .string()
    .optional()
    .describe(
      'Campo para mostrar o filtro especial (puede ser multipleStates:pendiente,confirmado)'
    )
    .openapi({ example: 'multipleStates:pendiente,confirmado' }),
  selectedValueOrder: z
    .string()
    .optional()
    .describe('Campo para ordenar')
    .openapi({ example: 'asc' }),
  searchQuery: z
    .string()
    .min(1, 'La consulta de búsqueda debe tener al menos 1 carácter')
    .optional()
    .describe('Consulta de búsqueda')
    .openapi({ example: 'Juan' }),
});

export const TurnoQuerySchema = z.object({
  cantItemsPerPage: z
    .string()
    .min(
      1,
      'La cantidad de items por página debe ser un número entero positivo'
    )
    .optional()
    .describe('Cantidad de items por página')
    .openapi({ example: '10' }),
  currentPage: z
    .string()
    .min(1, 'La página actual debe ser un número entero positivo')
    .optional()
    .describe('Página actual')
    .openapi({ example: '1' }),
  selectedValueShow: z
    .enum([
      'todos',
      'faltanCalificar',
      'calificados',
      'cancelados',
      'pendientes',
      'completado',
      'porPagar',
      'pagado',
      'pagoPendiente',
      'all',
    ])
    .optional()
    .describe('Campo para mostrar')
    .openapi({ example: 'pagado' }),
  selectedValueOrder: z
    .enum([
      'todos',
      'fechaA',
      'fechaD',
      'calificacionM',
      'calificacionP',
      'all',
    ])
    .optional()
    .describe('Campo para ordenar')
    .openapi({ example: 'fechaA' }),
});

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'Validation failed',
  }),
  errors: z
    .array(
      z.object({
        field: z.string().describe('Campo que falló').openapi({
          example: 'userId',
        }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'El UserID debe ser un número positivo',
        }),
      })
    )
    .optional()
    .describe('Detalles de errores de validación'),
});
