export class MercadoPagoIntegrationError extends Error {
  constructor(
    message: string,
    public readonly status: 502 | 503
  ) {
    super(message);
    this.name = 'MercadoPagoIntegrationError';
  }
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
}

// Las urls a donde Mercado Pago manda de vuelta al usuario despues de pagar
export interface MercadoPagoBackUrls {
  success: string;
  failure: string;
  pending: string;
}

export interface MercadoPagoPreferenceOpciones {
  backUrls?: MercadoPagoBackUrls;
  // 'approved' hace que Mercado Pago redirija solo, sin que el usuario tenga
  // que tocar el boton de "volver al sitio" de la pantalla de pago.
  autoReturn?: 'approved';
  // Lo usamos para despues poder relacionar el pago con la empresa que pago
  externalReference?: string;
}

export async function verificarIntegracionMercadoPago(): Promise<void> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new MercadoPagoIntegrationError(
      'La integración con Mercado Pago no está configurada en el servidor',
      503
    );
  }

  let response: Response;
  try {
    response = await fetch('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  } catch {
    throw new MercadoPagoIntegrationError(
      'No se pudo conectar con Mercado Pago',
      502
    );
  }

  if (!response.ok) {
    throw new MercadoPagoIntegrationError(
      response.status === 401 || response.status === 403
        ? 'Mercado Pago rechazó las credenciales configuradas'
        : 'Mercado Pago no pudo verificar las credenciales en este momento',
      502
    );
  }
}

export async function crearPreferenciaMercadoPago(
  items: MercadoPagoPreferenceItem[],
  opciones: MercadoPagoPreferenceOpciones = {}
): Promise<MercadoPagoPreference> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new MercadoPagoIntegrationError(
      'La integración con Mercado Pago no está configurada en el servidor',
      503
    );
  }

  let response: Response;
  try {
    response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          ...item,
          currency_id: 'ARS'
        })),
        ...(opciones.backUrls ? { back_urls: opciones.backUrls } : {}),
        ...(opciones.autoReturn ? { auto_return: opciones.autoReturn } : {}),
        ...(opciones.externalReference ? { external_reference: opciones.externalReference } : {})
      }),
      signal: AbortSignal.timeout(15_000)
    });
  } catch {
    throw new MercadoPagoIntegrationError(
      'No se pudo conectar con Mercado Pago para crear la preferencia',
      502
    );
  }

  if (!response.ok) {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago no pudo crear la preferencia de pago',
      502
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago devolvió una respuesta inválida al crear la preferencia',
      502
    );
  }

  if (
    !data ||
    typeof data !== 'object' ||
    !('id' in data) ||
    typeof data.id !== 'string' ||
    !('init_point' in data) ||
    typeof data.init_point !== 'string'
  ) {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago devolvió una respuesta incompleta al crear la preferencia',
      502
    );
  }

  return {
    id: data.id,
    init_point: data.init_point,
    ...('sandbox_init_point' in data && typeof data.sandbox_init_point === 'string'
      ? { sandbox_init_point: data.sandbox_init_point }
      : {})
  };
}

// Consulta el estado de un pago en Mercado Pago. Lo usamos para confirmar que
// el pago del plan Pro realmente se aprobo antes de actualizar al usuario.
export async function obtenerPagoMercadoPago(paymentId: string): Promise<{ status: string }> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new MercadoPagoIntegrationError(
      'La integración con Mercado Pago no está configurada en el servidor',
      503
    );
  }

  let response: Response;
  try {
    response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(15_000)
    });
  } catch {
    throw new MercadoPagoIntegrationError(
      'No se pudo conectar con Mercado Pago para consultar el pago',
      502
    );
  }

  if (!response.ok) {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago no pudo encontrar el pago indicado',
      502
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago devolvió una respuesta inválida al consultar el pago',
      502
    );
  }

  if (!data || typeof data !== 'object' || !('status' in data) || typeof data.status !== 'string') {
    throw new MercadoPagoIntegrationError(
      'Mercado Pago devolvió una respuesta incompleta al consultar el pago',
      502
    );
  }

  return { status: data.status };
}