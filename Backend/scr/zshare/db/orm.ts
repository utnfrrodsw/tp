
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";


export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'patas_alegres',
  clientUrl: 'mysql://dsw:dsw@localhost:3306/patas_alegres',
  type: 'mysql',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  }
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};

/*import { defineConfig } from '@mikro-orm/mysql';*/

/*export default defineConfig({
  dbName: 'my_database',
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 3306,
  entities: ['./dist/entities'],  // Ajusta según la ubicación de tus entidades
  migrations: {
    path: './dist/migrations',  // Ajusta según la ubicación de tus migraciones
  },
  seeder: {
    path: './dist/seeders',  // Ajusta según la ubicación de tus seeders
  },
});*/
