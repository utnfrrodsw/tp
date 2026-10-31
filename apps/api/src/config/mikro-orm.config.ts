import path from 'path';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const nombreArchivoActual = fileURLToPath(import.meta.url);
const carpetaActual = path.dirname(nombreArchivoActual);

dotenv.config({ path: path.resolve(carpetaActual, '../../../../.env') });

import { defineConfig } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

// Importo las entidades para que el orm las mapee a la bd
import { User } from '../entities/usuario.js';
import { Evento } from '../entities/evento.js';
import { Categoria } from '../entities/categoria.js';
import { Servicio } from '../entities/servicio.js';
import { EventoCategoria } from '../entities/evento-categoria.js';
import { Tablero } from '../entities/tablero.js';
import { TableroServicio } from '../entities/tablero-servicio.js';
import { SUPABASE_CA } from './supabase-ca.js';

// Para conectarme a la base uso DATABASE_URL o POSTGRES_URL si existen,
// y si no, las variables sueltas (DB_HOST, DB_USER, etc.)
const urlSource = process.env.DATABASE_URL
  ? 'DATABASE_URL'
  : process.env.POSTGRES_URL
    ? 'POSTGRES_URL'
    : null;

const clientUrl = process.env.DB_HOST ? undefined : (urlSource ? process.env[urlSource] : undefined);

// Configuración de SSL para conectarse a la base de datos de Supabase
const resolveSsl = () => {
  if (process.env.DB_SSL === 'false') return false;

  if (process.env.DB_SSL === 'no-verify') {
    console.warn('DB_SSL=no-verify: el certificado del servidor no se valida');
    return { rejectUnauthorized: false };
  }

  return { ca: process.env.DB_CA_CERT || SUPABASE_CA, rejectUnauthorized: true };
};

export default defineConfig({

  ...(clientUrl
    ? { clientUrl }
    : {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        dbName: process.env.DB_NAME || 'postgres'
      }),

  // driverOptions se pasa tal cual a pg: una clave "connection" la tomaría como
  // objeto Connection ya construido.
  driverOptions: {
    ssl: resolveSsl()
  },

  // Límite de conexiones abiertas a la vez contra la base
  pool: { min: 0, max: 2 },

  // El esquema se aplica con los scripts de migrations, no al conectar.
  ensureDatabase: false,

  entities: [  
    User,
    Evento,
    Categoria,
    Servicio,
    EventoCategoria,
    Tablero,
    TableroServicio
  ],

  metadataProvider: ReflectMetadataProvider,

  // El modo debug imprime cada query con sus parámetros: nunca en producción.
  debug: process.env.NODE_ENV !== 'production',

});