import { MikroORM, type Options, type IDatabaseDriver, type EntityManager, type EntityManagerType } from '@mikro-orm/core';
import { MySqlDriver } from './MySqlDriver';
import type { SqlEntityManager } from '@mikro-orm/knex';
/**
 * @inheritDoc
 */
export declare class MySqlMikroORM<EM extends EntityManager = SqlEntityManager> extends MikroORM<MySqlDriver, EM> {
    private static DRIVER;
    /**
     * @inheritDoc
     */
    static init<D extends IDatabaseDriver = MySqlDriver, EM extends EntityManager = D[typeof EntityManagerType] & EntityManager>(options?: Options<D, EM>): Promise<MikroORM<D, EM>>;
    /**
     * @inheritDoc
     */
    static initSync<D extends IDatabaseDriver = MySqlDriver, EM extends EntityManager = D[typeof EntityManagerType] & EntityManager>(options: Options<D, EM>): MikroORM<D, EM>;
}
export type MySqlOptions = Options<MySqlDriver>;
export declare function defineMySqlConfig(options: MySqlOptions): Options<MySqlDriver, SqlEntityManager<MySqlDriver> & EntityManager<IDatabaseDriver<import("@mikro-orm/core").Connection>>>;
