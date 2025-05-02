// src/shared/db/mikro-orm.config.ts
import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Usuario } from './entities/usuario.entity'; // Asegúrate de que la ruta de las entidades sea correcta

const config: Options<MySqlDriver> = {
  host: 'localhost',
  port: 3306,
  user: 'root',  // Cambia por tu usuario
  password: 'tu_contraseña',  // Cambia por tu contraseña
  dbName: 'tu_base_de_datos', // Cambia por tu base de datos
  entities: [Usuario],
  entitiesTs: ['./src/entities'], // Soporta tus entidades TypeScript
  debug: true,
  migrations: {
    path: './migrations',
    pathTs: './src/migrations',
  },
};

export default config;
