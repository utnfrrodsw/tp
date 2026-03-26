"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantOrder = void 0;
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
const update_1 = __importDefault(require("./update"));
const search_1 = __importDefault(require("./search"));
/**
 * Mercado Pago Merchant Order.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/merchant_orders/_merchant_orders/post Documentation }.
 */
class MerchantOrder {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
     * Mercado Pago Merchant Order create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/merchantOrder/create.ts Usage Example  }.
     */
    create({ body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ body, config: this.config });
    }
    /**
     * Mercado Pago Merchant Order get.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/merchantOrder/get.ts Usage Example  }.
     */
    get({ merchantOrderId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ merchantOrderId, config: this.config });
    }
    /**
     * Mercado Pago Merchant Order update.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/merchantOrder/update.ts Usage Example  }.
     */
    update({ merchantOrderId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ merchantOrderId, body, config: this.config });
    }
    /**
     * Mercado Pago Merchant Order search.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/merchantOrder/search.ts Usage Example  }.
     */
    search(merchantOrderSearchOptions = {}) {
        const { options, requestOptions } = merchantOrderSearchOptions;
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, search_1.default)({ options, config: this.config });
    }
}
exports.MerchantOrder = MerchantOrder;
