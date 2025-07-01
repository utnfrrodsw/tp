"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const get_1 = __importDefault(require("./get"));
/**
 * Mercado Pago User.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class User {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago User.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/user/get/get.ts Usage Example  }.
   */
    get(userGetData = {}) {
        const { requestOptions } = userGetData;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ config: this.config });
    }
}
exports.User = User;
