"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const get_1 = __importDefault(require("./get"));
/**
 * Mercado Pago PaymentMethods.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class PaymentMethod {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Search.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/paymentmethod/get.ts Usage Example  }.
   */
    get(paymentMethodsGetOptions = {}) {
        const { requestOptions } = paymentMethodsGetOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ config: this.config });
    }
}
exports.PaymentMethod = PaymentMethod;
