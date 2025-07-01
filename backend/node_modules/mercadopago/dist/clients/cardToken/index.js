"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardToken = void 0;
const create_1 = __importDefault(require("./create"));
/**
 * Mercado Pago CardTokens.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference Documentation }.
 */
class CardToken {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Create.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/cardtoken/create.ts Usage Example  }.
   */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
}
exports.CardToken = CardToken;
