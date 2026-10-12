// Cliente HTTP de MercadoPago: las DOS únicas llamadas que el sistema le hace a
// la pasarela.
//
//   createPreference()  crea la orden de pago y devuelve el link del checkout.
//   getPayment()        consulta cómo terminó un pago.
//
// Es un archivo aparte de las cinco capas habituales de una feature, y no una
// sexta capa "por las dudas". El motivo es concreto: el repositorio habla con
// NUESTRA base y este archivo habla con un servicio de terceros. Mezclarlos
// dejaría al service llamando a internet en el medio de una transacción, y haría
// imposible escribir el test de integración del webhook sin pegarle de verdad a
// MercadoPago. Con el gateway aislado, el test reemplaza este módulo y listo.
//
// Se usa fetch, que viene con Node: no hace falta el SDK de MercadoPago para dos
// requests, y así se ve exactamente qué se manda y qué vuelve.
import { env } from '../../shared/config/env';
import { AppError, BadRequestError } from '../../shared/errors/app-error';

/** Datos que necesita MercadoPago para armar la orden de pago. */
type PreferenceInput = {
  /** Lo que se está vendiendo: el nombre del plan. */
  title: string;
  /** Precio del plan, en la moneda configurada. */
  amount: number;
  /**
   * Referencia propia que MercadoPago devuelve tal cual al confirmar. Acá viaja
   * "<id_user>:<id_plan>": es lo que permite saber a quién y qué activarle
   * cuando el aviso del pago llega sin ningún otro contexto.
   */
  externalReference: string;
  /** Email del comprador. MercadoPago lo usa para prellenar el checkout. */
  payerEmail: string;
};

/** Lo que devuelve la creación de una preference, ya recortado a lo que se usa. */
export type PreferenceResult = {
  preferenceId: string;
  /** URL del checkout de MercadoPago: es a donde se manda al usuario. */
  checkoutUrl: string;
};

/** Un pago tal como lo informa MercadoPago, recortado a lo que se necesita. */
export type GatewayPayment = {
  id: string;
  /** 'approved', 'pending', 'rejected', 'cancelled', 'refunded'... */
  status: string;
  amount: number;
  /** Moneda del importe ('ARS'...). */
  currency: string | null;
  /** La referencia que mandamos al crear la preference. */
  externalReference: string | null;
};

/**
 * Corta si falta el access token.
 *
 * Es un 500 y no un 400 porque el que se equivocó no es el usuario que quiso
 * pagar: es el entorno, al que le falta una credencial.
 */
function requireAccessToken(): string {
  if (!env.mercadopago.accessToken) {
    // Qué variable falta es un dato para nosotros, no para el usuario: va al log
    // del servidor y la respuesta queda genérica.
    console.error('[mercadopago] Falta cargar MERCADOPAGO_ACCESS_TOKEN en el .env del backend.');
    throw new AppError('La pasarela de pago no está disponible en este momento.', 500);
  }
  return env.mercadopago.accessToken;
}

/**
 * ¿Esta URL la puede alcanzar MercadoPago desde afuera?
 *
 * Sirve para no mandarle direcciones locales, que rechaza. Se mira el host y no
 * el protocolo porque en desarrollo el frontend corre en http, y eso solo no es
 * el problema.
 *
 * @param url la dirección a evaluar.
 * @returns false si apunta a la máquina de quien desarrolla.
 */
function isPublicUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '::1';
  } catch {
    // Si no es una URL válida, tratarla como no pública es lo seguro: se manda
    // la preference sin auto_return en vez de que MercadoPago la rechace entera.
    return false;
  }
}

/**
 * Hace una request a la API de MercadoPago y devuelve su respuesta parseada.
 *
 * @param path ruta de la API, empezando con barra.
 * @param init método y body de la request; el token y los headers los pone esta función.
 * @returns el JSON de la respuesta.
 * @throws AppError si MercadoPago responde con error o si no se lo pudo alcanzar.
 */
async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const token = requireAccessToken();

  let response: Response;
  try {
    response = await fetch(`${env.mercadopago.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch {
    // Sin internet, o MercadoPago caído. Es un 502 y no un 500: el que falló es
    // un servicio de arriba, no nuestro código.
    throw new AppError('No se pudo contactar a la pasarela de pago. Probá de nuevo en un rato.', 502);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // El detalle de MercadoPago va al log del servidor y no a la respuesta: al
    // usuario no le sirve, y puede traer datos de la cuenta.
    console.error('[mercadopago] Error %d en %s: %j', response.status, path, body);
    throw new AppError('La pasarela de pago rechazó la operación.', 502);
  }

  return body;
}

export const paymentGateway = {
  /**
   * Crea la orden de pago en MercadoPago.
   * @param input qué se cobra, a quién y con qué referencia.
   * @returns el id de la preference y la URL del checkout.
   */
  async createPreference(input: PreferenceInput): Promise<PreferenceResult> {
    const body = {
      items: [
        {
          title: input.title,
          quantity: 1,
          unit_price: input.amount,
          currency_id: env.mercadopago.currency,
        },
      ],
      payer: { email: input.payerEmail },
      external_reference: input.externalReference,
      // Las tres puntas del retorno apuntan a la misma pantalla: es ella la que
      // lee el estado y decide qué mostrar.
      back_urls: {
        success: env.mercadopago.backUrl,
        failure: env.mercadopago.backUrl,
        pending: env.mercadopago.backUrl,
      },
      // Vuelve solo al sitio cuando el pago se aprueba, sin que el usuario tenga
      // que apretar "Volver al sitio".
      //
      // Solo se pide si la URL de retorno es pública: MercadoPago valida que
      // pueda alcanzarla y rechaza la preference entera con
      // "auto_return invalid. back_url.success must be defined" si apunta a
      // localhost. En desarrollo, entonces, el usuario vuelve con el botón.
      ...(isPublicUrl(env.mercadopago.backUrl) && { auto_return: 'approved' }),
      // Solo se manda si hay una URL pública configurada: MercadoPago rechaza la
      // preference si le pasamos un localhost como notification_url.
      ...(env.mercadopago.notificationUrl && {
        notification_url: env.mercadopago.notificationUrl,
      }),
    };

    const data = (await request('/checkout/preferences', {
      method: 'POST',
      body: JSON.stringify(body),
    })) as { id?: string; init_point?: string; sandbox_init_point?: string };

    // init_point es el checkout real y sandbox_init_point el de prueba. Con
    // credenciales de prueba MercadoPago devuelve los dos, y el que corresponde
    // usar es el de sandbox.
    const checkoutUrl = data.sandbox_init_point ?? data.init_point;

    if (!data.id || !checkoutUrl) {
      throw new AppError('La pasarela de pago no devolvió un link de checkout.', 502);
    }

    return { preferenceId: data.id, checkoutUrl };
  },

  /**
   * Consulta un pago en MercadoPago.
   *
   * Es la llamada que hace que el sistema NUNCA confíe en lo que le mandan: ni el
   * webhook ni la pantalla de retorno dicen si un pago se aprobó, solo dicen qué
   * id mirar. Quién decide es esta consulta, hecha con nuestro access token.
   *
   * @param id id del pago en MercadoPago.
   * @returns el pago con su estado, o null si ese id no existe.
   */
  async getPayment(id: string): Promise<GatewayPayment | null> {
    const data = (await request(`/v1/payments/${encodeURIComponent(id)}`)) as {
      id?: number | string;
      status?: string;
      transaction_amount?: number;
      currency_id?: string | null;
      external_reference?: string | null;
    };

    if (!data.id || !data.status) return null;

    return {
      id: String(data.id),
      status: data.status,
      amount: data.transaction_amount ?? 0,
      currency: data.currency_id ?? null,
      externalReference: data.external_reference ?? null,
    };
  },
};

/**
 * Parsea la referencia externa "<id_user>:<id_plan>" que viaja con el pago.
 *
 * Es la única pista que trae un aviso de MercadoPago sobre a quién pertenece la
 * operación, así que si viene rota no hay forma de saber a quién activarle la
 * membresía.
 *
 * @param reference el external_reference devuelto por la pasarela.
 * @returns los dos ids ya como números.
 * @throws 400 si falta o no tiene el formato esperado.
 */
export function parseExternalReference(reference: string | null): {
  id_user: number;
  id_plan: number;
} {
  const parts = (reference ?? '').split(':');
  const id_user = Number(parts[0]);
  const id_plan = Number(parts[1]);

  if (parts.length !== 2 || !Number.isInteger(id_user) || !Number.isInteger(id_plan)) {
    throw new BadRequestError('El pago no tiene una referencia válida a un usuario y un plan.');
  }

  return { id_user, id_plan };
}
