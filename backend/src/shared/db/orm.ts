// src/shared/db/orm.ts
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, './../../../../.env') });
}

console.log('process.env.LOCAL:', process.env.LOCAL);
const local = process.env.LOCAL === 'true';
const DB_URL = local
  ? 'mysql://root:root@localhost:3306/homeservice'
  : 'mysql://u797556926_reformix:LUISluis123!@srv2023.hstgr.io:3306/u797556926_homeService';

console.log('DB_URL:', DB_URL);
const DEBUG = local ? true : process.env.DEBUG_SQL === '1';

const orm = await MikroORM.init({
  driver: MySqlDriver,
  entities: ['dist/**/*.entity.js'], // para producción
  entitiesTs: ['src/**/*.entity.ts'], // para desarrollo TS
  clientUrl: DB_URL,
  highlighter: new SqlHighlighter(),
  debug: DEBUG,
  seeder: {
    path: path.join(__dirname, '../../seeders'), // ruta compilada (dist) a seeders
    pathTs: path.join(__dirname, '../seeders'), // ruta TS a seeders
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  try {
    const generator = orm.getSchemaGenerator();
    //!Descomentar el siguiente bloque de lineas hasta arriba del catch para crear y seedear la base
    /*
    
    console.log('❌ Borrando todas las tablas...');
    await generator.dropSchema();

    console.log('✅ Creando tablas nuevas...');
    await generator.createSchema();

    console.log('🌱 Ejecutando seeders...');
    const seeder = orm.getSeeder();

    try {
      console.log(
        '🔍 Debugger: Intentando ejecutar seed con DatabaseSeeder...'
      );
      // Importar el DatabaseSeeder y ejecutarlo específicamente
      const { DatabaseSeeder } = await import(
        '../../seeders/DatabaseSeeder.js'
      );
      await seeder.seed(DatabaseSeeder);
      console.log('✅ Debugger: DatabaseSeeder ejecutado exitosamente');
    } catch (error: any) {
      console.error('❌ Error en seeder:', error);
      console.error('❌ Stack:', error?.stack);
    }

    // // // Verificación rápida
    const em = orm.em.fork(); */
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  }
};

export { orm };
