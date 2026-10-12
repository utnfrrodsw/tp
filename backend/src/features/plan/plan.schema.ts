// Schemas de Zod para validar la entrada de los endpoints de planes.
// Los usa el middleware validate() en plan.routes.ts, antes del controller.
import { z } from 'zod';

// El precio del plan. Es plata, así que la columna es un DECIMAL(10,2) y acá se
// pide lo mismo: mayor a cero y con dos decimales como mucho.
//
// Tiene que ser mayor a cero porque solo se edita el precio del plan pago: un Pro
// en $0 no se podría comprar (el checkout rechaza los planes sin costo).
//
// El tope de 99.999.999,99 es el que aguanta un DECIMAL(10,2). Sin este chequeo
// un monto más grande lo rechazaría MySQL con un error de rango, que sale como
// un 500 y no le dice nada a quien cargó el formulario.
const amountSchema = z.coerce
  .number({ error: 'El monto tiene que ser un número.' })
  .gt(0, 'El monto tiene que ser mayor a cero.')
  .max(99999999.99, 'El monto es demasiado grande.')
  // La columna guarda dos decimales: un 3500.999 se redondearía solo al insertar,
  // y el plan terminaría costando algo distinto de lo que se cargó.
  //
  // Se compara contra el valor redondeado a centavos en vez de pedir que
  // `value * 100` sea entero, porque en punto flotante 35.15 * 100 da
  // 3514.9999999999995 y un monto perfectamente válido quedaría rechazado.
  .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.001, {
    message: 'El monto puede tener dos decimales como máximo.',
  });

// El :id de la URL llega siempre como string; se valida y convierte a número acá,
// así el resto de las capas ya lo reciben tipado como number.
export const planIdParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo.'),
});

// Cambio de precio (PATCH /api/plans/:id). Es lo único editable de un plan: el
// nombre y la descripción no se reciben, y si vinieran Zod los descarta.
export const updatePlanPriceSchema = z.object({
  amount: amountSchema,
});

export type PlanIdParam = z.infer<typeof planIdParamSchema>;
export type UpdatePlanPriceInput = z.infer<typeof updatePlanPriceSchema>;
