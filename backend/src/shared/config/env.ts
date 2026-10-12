// Lee y valida las variables de entorno una sola vez al arrancar la app.
// Si falta una variable obligatoria, el proceso falla acá con un mensaje claro
// en vez de romper más adelante con un error confuso de conexión.
import 'dotenv/config';

// Devuelve el valor de una variable obligatoria; corta la ejecución si no está.
function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá backend/.env.example a backend/.env y completala.`
    );
  }
  return value;
}

// Devuelve el valor de una variable opcional, o el default indicado.
function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

// Interpreta una variable de texto como booleano ("true" / "false").
function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return value.toLowerCase() === 'true';
}

// Interpreta una variable como lista separada por comas, descartando vacíos.
function list(name: string, fallback: string): string[] {
  return optional(name, fallback)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

const isProduction = optional('NODE_ENV', 'development') === 'production';

// Valor de JWT_SECRET que trae .env.example. Sirve para desarrollar, pero
// cualquiera que lea el repo lo conoce: en producción equivale a no tener secreto.
const EXAMPLE_JWT_SECRET = 'dev-secret-cambiar-antes-de-produccion';
const MIN_PRODUCTION_SECRET_LENGTH = 32;

/**
 * Devuelve el secreto del JWT. En producción además exige que no sea el de
 * ejemplo y que sea largo: con un secreto adivinable, cualquiera podría firmarse
 * un token de ADMIN.
 */
function jwtSecret(): string {
  const secret = required('JWT_SECRET');
  if (isProduction && (secret === EXAMPLE_JWT_SECRET || secret.length < MIN_PRODUCTION_SECRET_LENGTH)) {
    throw new Error(
      `JWT_SECRET es inseguro para producción: generá uno aleatorio de al menos ${MIN_PRODUCTION_SECRET_LENGTH} caracteres (ver backend/.env.example).`
    );
  }
  return secret;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction,
  port: Number(optional('PORT', '3000')),
  // Orígenes habilitados para CORS, separados por coma. Se aceptan varios porque
  // Vite se corre al siguiente puerto libre (5174, 5175...) si el 5173 está
  // ocupado por otro proyecto, y si no el frontend queda sin poder llamar a la API.
  corsOrigin: list('CORS_ORIGIN', 'http://localhost:5173,http://localhost:5174,http://localhost:5175'),

  db: {
    host: required('DB_HOST'),
    port: Number(optional('DB_PORT', '3306')),
    name: required('DB_NAME'),
    user: required('DB_USER'),
    password: optional('DB_PASSWORD', ''),
    // En MySQL local va en false. En el servicio cloud (Aiven) va en true
    // y hay que cargar el certificado CA que provee el proveedor.
    ssl: bool('DB_SSL', false),
    sslCa: optional('DB_SSL_CA', ''),
    // sync crea/actualiza las tablas al arrancar. Solo para desarrollo.
    sync: bool('DB_SYNC', false),
    logging: bool('DB_LOGGING', false),
  },

  // Servicio de metadata musical (Deezer). Lo usa ÚNICAMENTE el script de descarga
  // `seed/fetch-metadata.ts`, que se corre a mano una sola vez. Ni la API ni el
  // frontend consultan este servicio en runtime.
  metadata: {
    baseUrl: optional('METADATA_API_BASE_URL', 'https://api.deezer.com'),
    // Deezer limita a ~50 pedidos cada 5 segundos por IP. 150ms entre llamadas deja
    // un margen cómodo por debajo de ese techo.
    requestDelayMs: Number(optional('METADATA_REQUEST_DELAY_MS', '150')),
    maxRetries: Number(optional('METADATA_MAX_RETRIES', '4')),
  },

  // Usuario administrador que crea el seed. Tiene valores por defecto para que la
  // base quede usable con solo clonar el repo y correr `npm run seed`; en un entorno
  // real se pisan desde el .env.
  seedAdmin: {
    username: optional('SEED_ADMIN_USERNAME', 'admin'),
    email: optional('SEED_ADMIN_EMAIL', 'admin@musicboxd.com'),
    password: optional('SEED_ADMIN_PASSWORD', 'Admin1234!'),
  },

  // Pasarela de pago (MercadoPago Checkout Pro, en sandbox).
  //
  // El access token NO es obligatorio para arrancar: el resto del sistema anda
  // sin él, y frenar el servidor entero porque falta la credencial de una sola
  // feature dejaría a todo el equipo sin poder trabajar. La falta se chequea
  // recién al intentar cobrar, con un mensaje que explica qué cargar.
  mercadopago: {
    accessToken: optional('MERCADOPAGO_ACCESS_TOKEN', ''),
    baseUrl: optional('MERCADOPAGO_API_BASE_URL', 'https://api.mercadopago.com'),
    // Moneda de los precios. Los planes están en pesos argentinos.
    currency: optional('MERCADOPAGO_CURRENCY', 'ARS'),
    // A dónde vuelve el usuario después de pagar. Es una URL del FRONTEND, no de
    // la API: la pantalla de retorno es una página de React.
    backUrl: optional('MERCADOPAGO_BACK_URL', 'http://localhost:5173/pro/return'),
    // A dónde avisa MercadoPago cuando cambia el estado de un pago. Tiene que ser
    // una URL pública: localhost no le llega. Se deja vacía en desarrollo, y ahí
    // la confirmación la resuelve la pantalla de retorno (ver payment.service).
    notificationUrl: optional('MERCADOPAGO_NOTIFICATION_URL', ''),
  },

  // Autenticación. El secreto es obligatorio: sin él la API firmaría los tokens
  // con una clave vacía y cualquiera podría fabricarse uno de ADMIN. Preferimos
  // que el servidor no arranque a que arranque inseguro.
  auth: {
    jwtSecret: jwtSecret(),
    jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },
} as const;
