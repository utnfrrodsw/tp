import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MongoDriver } from "@mikro-orm/mongodb";

export const orm = await MikroORM.init<MongoDriver>({
  driver: MongoDriver,
  entities: ["dist/**/*.entity.js"], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ["src/**/*.entity.ts"], // path to our TS entities (src), relative to `baseDir`
  dbName: "tp-desuentos",
  clientUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  highlighter: new MongoHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const sysncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

};

//await generator.dropSchema();
//await generator.createSchema();