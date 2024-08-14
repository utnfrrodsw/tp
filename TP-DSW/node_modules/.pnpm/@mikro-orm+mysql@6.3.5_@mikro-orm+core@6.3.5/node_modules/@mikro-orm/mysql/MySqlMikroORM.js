"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlMikroORM = void 0;
exports.defineMySqlConfig = defineMySqlConfig;
const core_1 = require("@mikro-orm/core");
const MySqlDriver_1 = require("./MySqlDriver");
/**
 * @inheritDoc
 */
class MySqlMikroORM extends core_1.MikroORM {
    static DRIVER = MySqlDriver_1.MySqlDriver;
    /**
     * @inheritDoc
     */
    static async init(options) {
        return super.init(options);
    }
    /**
     * @inheritDoc
     */
    static initSync(options) {
        return super.initSync(options);
    }
}
exports.MySqlMikroORM = MySqlMikroORM;
/* istanbul ignore next */
function defineMySqlConfig(options) {
    return (0, core_1.defineConfig)({ driver: MySqlDriver_1.MySqlDriver, ...options });
}
