import type { Request, Response } from 'express';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';
import {
  crearPreferenciaMercadoPago,
  obtenerPagoMercadoPago,
  MercadoPagoIntegrationError,
  verificarIntegracionMercadoPago
} from '../mercadoPago.js';
import { setUsuarioPlan } from '../../usuarios/services/usuario.service.js';
import type {
  CreatePaymentPreferenceDto,
  CreatePlanProPreferenceDto,
  ConfirmarPlanProDto
} from '../dtos/payment.dto.js';

// Precio fijo del plan Pro, en pesos argentinos
const PRECIO_PLAN_PRO = 2000;

const sendMercadoPagoError = (res: Response, error: unknown, fallbackMessage: string) => {
  if (error instanceof MercadoPagoIntegrationError) {
    const code = error.status === 503 ? 'SERVICE_UNAVAILABLE' : 'BAD_GATEWAY';
    return respondWithError(res, error.status, code, error.message);
  }
  return sendApiError(res, error, fallbackMessage);
};

export const probarIntegracionMercadoPago = async (_req: Request, res: Response) => {
  try {
    await verificarIntegracionMercadoPago();
    res.json({ message: 'La integración con Mercado Pago funciona correctamente' });
  } catch (error) {
    return sendMercadoPagoError(res, error, 'No se pudo verificar la integración con Mercado Pago');
  }
};

export const crearPreferenciaPago = async (
  req: Request<{}, {}, CreatePaymentPreferenceDto>,
  res: Response
) => {
  try {
    const preferencia = await crearPreferenciaMercadoPago(req.body.items);
    res.status(201).json({
      preferenceId: preferencia.id,
      initPoint: preferencia.init_point,
      ...(preferencia.sandbox_init_point
        ? { sandboxInitPoint: preferencia.sandbox_init_point }
        : {})
    });
  } catch (error) {
    return sendMercadoPagoError(res, error, 'No se pudo crear la preferencia de pago');
  }
};

// Crea la preferencia de pago del plan Pro para que la empresa la pague en Mercado Pago
export const crearCheckoutPlanPro = async (
  req: Request<{}, {}, CreatePlanProPreferenceDto>,
  res: Response
) => {
  const { usuarioId, origin } = req.body;

  // Mercado Pago solo permite "auto_return" (volver solo, sin que el usuario
  // toque ningun boton) cuando la url de exito es https. En desarrollo el
  // sitio corre en http://localhost, asi que ahi no lo mandamos: Mercado Pago
  // igual nos redirige de vuelta, pero mostrando antes su boton de "volver al sitio".
  const esHttps = origin.startsWith('https://');

  try {
    const preferencia = await crearPreferenciaMercadoPago(
      [
        {
          title: 'Plan Pro - PlanIt',
          quantity: 1,
          unit_price: PRECIO_PLAN_PRO
        }
      ],
      {
        // Mercado Pago nos manda de vuelta a estas urls cuando termina el pago
        backUrls: {
          success: `${origin}/?pago=pro`,
          failure: `${origin}/?pago=pro&resultado=fallido`,
          pending: `${origin}/?pago=pro&resultado=pendiente`
        },
        ...(esHttps ? { autoReturn: 'approved' as const } : {}),
        externalReference: String(usuarioId)
      }
    );

    res.status(201).json({
      preferenceId: preferencia.id,
      initPoint: preferencia.init_point,
      ...(preferencia.sandbox_init_point
        ? { sandboxInitPoint: preferencia.sandbox_init_point }
        : {})
    });
  } catch (error) {
    return sendMercadoPagoError(res, error, 'No se pudo iniciar el pago del plan Pro');
  }
};

// Confirma el pago del plan Pro: le pregunta a Mercado Pago si realmente se aprobo
// y recien ahi actualiza el plan de la empresa en la base de datos.
export const confirmarPlanPro = async (
  req: Request<{}, {}, ConfirmarPlanProDto>,
  res: Response
) => {
  const { usuarioId, paymentId } = req.body;

  try {
    const pago = await obtenerPagoMercadoPago(paymentId);

    if (pago.status !== 'approved') {
      return respondWithError(res, 400, 'BAD_REQUEST', 'El pago todavía no fue aprobado por Mercado Pago');
    }

    const usuario = await setUsuarioPlan(usuarioId, 'pro');

    if (!usuario) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Usuario no encontrado');
    }

    res.json({
      message: 'Listo, tu cuenta ahora es Pro',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        plan: usuario.plan
      }
    });
  } catch (error) {
    return sendMercadoPagoError(res, error, 'No se pudo confirmar el pago del plan Pro');
  }
};
