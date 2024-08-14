import { type Configuration, type EntityDictionary, type FilterQuery, type NativeInsertUpdateManyOptions, type QueryResult, type UpsertManyOptions } from '@mikro-orm/core';
import { AbstractSqlDriver, MySqlConnection, MySqlPlatform } from '@mikro-orm/knex';
export declare class MySqlDriver extends AbstractSqlDriver<MySqlConnection, MySqlPlatform> {
    protected autoIncrementIncrement?: number;
    constructor(config: Configuration);
    private getAutoIncrementIncrement;
    nativeInsertMany<T extends object>(entityName: string, data: EntityDictionary<T>[], options?: NativeInsertUpdateManyOptions<T>): Promise<QueryResult<T>>;
    nativeUpdateMany<T extends object>(entityName: string, where: FilterQuery<T>[], data: EntityDictionary<T>[], options?: NativeInsertUpdateManyOptions<T> & UpsertManyOptions<T>): Promise<QueryResult<T>>;
}
