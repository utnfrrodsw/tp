// src/mikro-orm.config.ts
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { defineConfig } from '@mikro-orm/mysql';

// entidades (asegurate de que existen estos archivos)
import { Usuario } from './entities/usuario.entity';
import { Autor } from './entities/autor.entity';
import { Editorial } from './entities/editorial.entity';
import { Libro } from './entities/libro.entity';
import { Resena } from './entities/resena.entity';
import { Categoria } from './entities/categoria.entity';
import { ContenidoLista } from './entities/contenidoLista.entity';
import { Favorito } from './entities/favorito.entity';
import { Lista } from './entities/lista.entity';
import { Reaccion } from './entities/reaccion.entity';
import { Saga } from './entities/saga.entity';
import { Seguimiento } from './entities/seguimiento.entity';

// nuevas entidades que agregaste
import { Actividad } from './entities/actividad.entity';
import { Permiso } from './entities/permiso.entity';
import { RatingLibro } from './entities/ratingLibro.entity';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterCampaign } from './entities/newsletterCampaign.entity';
import { PasswordResetToken } from './entities/passwordResetToken.entity';
import { Notificacion } from './entities/notificacion.entity';

// Pool configuration: optimized for free-tier databases with 5 connection limit
const poolMax = Number(process.env.DB_POOL_MAX ?? 2); // Default 2 for Clever Cloud free tier
const poolMin = Number(process.env.DB_POOL_MIN ?? 0);

const config: Options<MySqlDriver> = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: [
    Usuario, Autor, Categoria, Editorial, Libro, Resena, ContenidoLista, Favorito,
    Lista, Reaccion, Saga, Seguimiento, Actividad, Permiso, RatingLibro, Newsletter,
    NewsletterCampaign,
    PasswordResetToken, Notificacion
  ],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  allowGlobalContext: true,
  connect: false, // Don't auto-connect - we'll manage it explicitly
  
  // Pool configuration - critical for free-tier databases
  pool: {
    min: poolMin,           // 0 = no pre-allocated connections
    max: poolMax,           // 2 = respects Clever Cloud 5-connection limit
    acquireTimeoutMillis: 30000,  // Wait up to 30s to acquire connection
    idleTimeoutMillis: 30000,     // Close idle connections after 30s
  },
  
  // MySQL driver connection options
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false },
      connectionLimit: poolMax,  // Redundant but explicit
      waitForConnections: true,
      queueLimit: 0,  // No limit on queued requests
    },
  },
};

export default defineConfig(config);
