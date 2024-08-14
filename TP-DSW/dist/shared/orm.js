import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'consultorios',
    driver: MySqlDriver,
    driverOptions: {
        host: 'localhost',
        port: 3306,
        user: 'dsw',
        password: 'dsw',
        dbName: 'consultorios',
    },
    clientUrl: 'mysql://dsw:dsw@localhost:3306/consultorios',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        //never in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema();
};
//# sourceMappingURL=orm.js.map