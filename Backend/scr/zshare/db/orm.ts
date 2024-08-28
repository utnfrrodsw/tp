import { MikroORM} from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js}'],
  entitiesTs: ['src/**/*.entity.ts}'],
  dbName : 'patas-alegre',
  clientUrl: 'mysql://dsw:dsw@localhost:3306/patasalegres',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: { //never in production por que puede borrar la base de datos
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  }
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  await generator.createSchema()
  await generator.updateSchema()
}

//esto genera la base de datos si no existe y si existe la actualización