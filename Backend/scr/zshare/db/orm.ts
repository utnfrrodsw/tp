
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
  // await generator.dropSchema();
  // await generator.createSchema();
  await generator.updateSchema();
};
