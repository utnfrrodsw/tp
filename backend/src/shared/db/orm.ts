<<<<<<< HEAD
import { MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
=======
import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
>>>>>>> origin/luis


export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'homeService',
<<<<<<< HEAD
  clientUrl: 'mysql://dsw:dsw@localhost:3306/homeService',
=======
  clientUrl: 'mysql://root:root@localhost:3306/homeService',
>>>>>>> origin/luis
  highlighter: new SqlHighlighter(),
  debug: true,
  driver: MySqlDriver,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});
<<<<<<< HEAD
=======


>>>>>>> origin/luis

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema();
};

export {};
