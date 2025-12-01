import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { usuarioBaseSchema } from '../usuario/usuario.schemas';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// ===================================================================================================================
// ========================================== Turno Schema ===========================================================
// ===================================================================================================================
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

// ===================================================================================================================
// ========================================== Schema basico de pago ==================================================
// ===================================================================================================================
export const pagoBaseSchema = z.object({
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
// ========================================== Schema de pago basico con id de tunro====================================================
// ===================================================================================================================
export const baseSchemaWithTurnoId = pagoBaseSchema.extend({
  turno: z
    .number()
    .int()
    .positive('El ID del turno debe ser un número positivo')
    .describe('ID del turno asociado al pago')
    .openapi({ example: 15 }),
});

// ===================================================================================================================
// ========================================== Schema de nuevo pago====================================================
// ===================================================================================================================
export const createPagoValidationSchema = pagoBaseSchema
  .extend({
    id: z.number().describe('ID del turno').openapi({
      example: 1,
    }),
    turno: z
      .number()
      .int()
      .positive('El ID del turno debe ser un número positivo')
      .describe('ID del turno asociado al pago')
      .openapi({ example: 15 }),
  })
  .openapi({
    title: 'CreatePago',
    description: 'Esquema para crear un nuevo pago',
  });

// ===================================================================================================================
// ========================================== Schema get =========================================
// ===================================================================================================================

export const getPagoSchema = pagoBaseSchema
  .extend({
    id: z.number().describe('ID del turno').openapi({
      example: 1,
    }),
    turno: turnoSchema,
  })
  .openapi({
    title: 'GetPago',
    description: 'Esquema para obtener un pago existente',
  });

// ===================================================================================================================
// ========================================== Schema de borrado de pago =========================================
// ===================================================================================================================
export const deletePagoSchema = pagoBaseSchema
  .extend({
    id: z.number().describe('ID del turno').openapi({
      example: 1,
    }),
    turno: turnoSchema,
  })
  .openapi({
    title: 'DeletePago',
    description: 'Esquema para eliminar un pago existente',
  });

// ===================================================================================================================
// ========================================== Schema de actualización de pago =========================================
// ===================================================================================================================
export const updatePagoValidationSchema = pagoBaseSchema
  .extend({
    id: z.number().describe('ID del turno').openapi({
      example: 1,
    }),
    turno: turnoSchema,
  })
  .partial()
  .openapi({
    title: 'UpdatePago',
    description: 'Esquema para actualizar un pago existente',
  });

// ===================================================================================================================
// ========================================== Error Schema ===========================================================
// ===================================================================================================================
export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'Ocurrió un error inesperado',
  }),
  statusCode: z.number().describe('Código de estado HTTP').openapi({
    example: 500,
  }),
  details: z
    .array(z.string())
    .optional()
    .describe('Detalles adicionales del error')
    .openapi({
      example: ['Detalle 1', 'Detalle 2'],
    }),
});

// ===================================================================================================================
// ========================================== validar id  ==================================================
// ===================================================================================================================

export const validacionIdSchema = z
  .object({
    id: z
      .string()
      .regex(/^\d+$/, 'El ID debe ser un número válido')
      .describe('ID del recurso')
      .openapi({ example: '123' }),
  })
  .describe('Esquema para validar el parámetro ID');

// Agregar esquema para validar el parámetro ID
export const idParamValidation = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número válido')
    .describe('ID del recurso')
    .openapi({ example: '123' }),
});

export const idUserParamValidation = z.object({
  usuarioId: z
    .string()
    .regex(/^\d+$/, 'El ID del usuario debe ser un número válido')
    .describe('ID del usuario')
    .openapi({ example: '123' }),
});
