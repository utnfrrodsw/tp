"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlDriver = void 0;
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
class MySqlDriver extends knex_1.AbstractSqlDriver {
    autoIncrementIncrement;
    constructor(config) {
        super(config, new knex_1.MySqlPlatform(), knex_1.MySqlConnection, ['knex', 'mysql2']);
    }
    async getAutoIncrementIncrement(ctx) {
        if (this.autoIncrementIncrement == null) {
            // the increment step may differ when running a cluster, see https://github.com/mikro-orm/mikro-orm/issues/3828
            const res = await this.connection.execute(`show variables like 'auto_increment_increment'`, [], 'get', ctx, { enabled: false });
            /* istanbul ignore next */
            this.autoIncrementIncrement = res?.Value ? +res?.Value : 1;
        }
        return this.autoIncrementIncrement;
    }
    async nativeInsertMany(entityName, data, options = {}) {
        options.processCollections ??= true;
        const res = await super.nativeInsertMany(entityName, data, options);
        const pks = this.getPrimaryKeyFields(entityName);
        const ctx = options.ctx;
        const autoIncrementIncrement = await this.getAutoIncrementIncrement(ctx);
        data.forEach((item, idx) => res.rows[idx] = { [pks[0]]: item[pks[0]] ?? res.insertId + (idx * autoIncrementIncrement) });
        res.row = res.rows[0];
        return res;
    }
    async nativeUpdateMany(entityName, where, data, options = {}) {
        const res = await super.nativeUpdateMany(entityName, where, data, options);
        const pks = this.getPrimaryKeyFields(entityName);
        const ctx = options.ctx;
        const autoIncrementIncrement = await this.getAutoIncrementIncrement(ctx);
        let i = 0;
        const rows = where.map(cond => {
            if (res.insertId != null && core_1.Utils.isEmpty(cond)) {
                return { [pks[0]]: res.insertId + (i++ * autoIncrementIncrement) };
            }
            if (cond[pks[0]] == null) {
                return undefined;
            }
            return { [pks[0]]: cond[pks[0]] };
        });
        if (rows.every(i => i !== undefined)) {
            res.rows = rows;
        }
        res.row = res.rows[0];
        return res;
    }
}
exports.MySqlDriver = MySqlDriver;
