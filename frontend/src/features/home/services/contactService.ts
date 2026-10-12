// Servicio del formulario de contacto: manda el mensaje a Web3Forms, que lo
// reenvía por mail a la casilla del equipo.
//
// Es la ÚNICA excepción a la regla de pasar siempre por core/services/httpClient,
// y es a propósito: httpClient le pega a NUESTRA API y le adjunta el token de
// sesión del usuario. Usarlo acá le mandaría ese token a un servicio de afuera.
// Por eso este servicio usa fetch directo, sin headers de autenticación.
import { ApiError } from '../../../core/utils/errorHandler';

/** Lo que escribe el usuario en /contact. */
export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /**
   * Trampa para bots: un campo oculto que una persona nunca completa. Si llega
   * marcado, Web3Forms descarta el mensaje. Como la access key es pública, es lo
   * que evita que usen el formulario para llenar de spam la casilla.
   */
  botcheck: boolean;
};

/** Lo que responde Web3Forms. */
type Web3FormsResponse = {
  success: boolean;
  message: string;
};

export const contactService = {
  /**
   * Envía el mensaje de contacto.
   * @throws ApiError si falta la access key, si no hay conexión o si Web3Forms lo rechaza.
   */
  async send(input: ContactInput): Promise<void> {
    // La URL y la key vienen del .env, igual que la de nuestra API: ninguna URL
    // se hardcodea en el código.
    const url = import.meta.env.VITE_WEB3FORMS_URL;
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    // Sin alguna de las dos el envío fallaría igual; así el mensaje explica qué falta.
    if (!url || !accessKey) {
      // Status 500 y no 0: el 0 lo reserva ApiError para 'sin conexión'.
      throw new ApiError('El formulario de contacto no está configurado todavía.', 500);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Musicboxd — Mensaje de contacto de ${input.name}`,
          from_name: 'Musicboxd',
          name: input.name,
          email: input.email,
          message: input.message,
          botcheck: input.botcheck,
        }),
      });
    } catch {
      throw ApiError.network();
    }

    const data = (await response.json().catch(() => null)) as Web3FormsResponse | null;

    if (!response.ok || !data?.success) {
      throw new ApiError(
        'No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.',
        response.status
      );
    }
  },
};
