// Backend/src/shared/mikro-orm.config.ts

import { defineConfig } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';

export default defineConfig({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Utenianos2025',
  dbName: 'tp_dsw304',
  entities: [Usuario], // entidades en ejecución
  debug: true,
  migrations: {
    path: 'dist/migrations',    // compilado
    pathTs: 'Backend/src/migrations',  // fuente TS
  },
});
