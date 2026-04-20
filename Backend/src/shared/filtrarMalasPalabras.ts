// src/shared/filtrarMalasPalabras.ts
import axios from 'axios';

type NeutrinoResponse = {
  'is-bad'?: boolean | string | number;
  'censored-content'?: string;
  [key: string]: any;
};

export const contieneMalasPalabras = async (texto: string): Promise<boolean> => {
  const userId = process.env.NEUTRINO_USER_ID;
  const apiKey = process.env.NEUTRINO_API_KEY;

  console.log('NEUTRINO_USER_ID:', userId ? '***' : 'undefined');
  console.log('NEUTRINO_API_KEY:', apiKey ? '***' : 'undefined');

  if (!userId || !apiKey) {
    throw new Error(
      'Credenciales de Neutrino API no configuradas. Configura NEUTRINO_USER_ID y NEUTRINO_API_KEY en .env'
    );
  }

  const url = 'https://neutrinoapi.net/bad-word-filter';

  // Preparar body urlencoded
  const params = new URLSearchParams();
  params.append('content', texto);
  params.append('censor-character', '*');

  try {
    const response = await axios.post<NeutrinoResponse>(
      url,
      params.toString(),
      {
        auth: {
          username: userId,
          password: apiKey,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000, // 5s, ajustar según necesidad
      }
    );

    // Comprueba status y existencia de data
    if (response.status !== 200 || !response.data) {
      console.error('Neutrino API respondió con status inesperado', {
        status: response.status,
        data: response.data,
      });
      throw new Error('Respuesta inesperada de la API de filtrado de palabras.');
    }

    const raw = response.data['is-bad'];

    // Normalizar a boolean
    const isBad =
      raw === true ||
      raw === 1 ||
      raw === '1' ||
      String(raw).toLowerCase() === 'true';

    return Boolean(isBad);
  } catch (error: any) {
    // Mejor diagnóstico según tipo de error de axios
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error('Error Axios al verificar malas palabras', {
        message: error.message,
        status,
        data,
      });

      if (status === 401 || status === 403) {
        throw new Error('Credenciales inválidas para Neutrino API (401/403). Revisa NEUTRINO_USER_ID / NEUTRINO_API_KEY.');
      }
      if (status === 429) {
        throw new Error('Límite de peticiones alcanzado (429) en Neutrino API.');
      }
      if (status && status >= 500) {
        throw new Error('Error en el servidor de la API de filtrado. Intenta más tarde.');
      }

      // timeout u otros errores de red
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado al contactar la API de filtrado.');
      }

      // Por defecto, lanzamos error general (puedes decidir rechazar la reseña o permitirla según política)
      throw new Error('No se pudo verificar el contenido. Rechazando por precaución.');
    }

    // Error no-axios
    console.error('Error no-axios al verificar malas palabras', error);
    throw new Error('No se pudo verificar el contenido. Rechazando por precaución.');
  }
};
