"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentificationType = void 0;
const list_1 = __importDefault(require("./list"));
/**
 * Mercado Pago IdentificationType.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/identification_types/_identification_types/get Documentation }.
 */
class IdentificationType {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
   * Mercado Pago Identification Types get.
   *
   * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/examples/identificationtype/list.ts Usage Example  }.
   */
    list(identificationTypeListOptions = {}) {
        const { requestOptions } = identificationTypeListOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, list_1.default)({ config: this.config });
    }
}
exports.IdentificationType = IdentificationType;
