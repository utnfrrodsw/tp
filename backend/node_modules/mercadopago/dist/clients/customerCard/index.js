"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCard = void 0;
const get_1 = __importDefault(require("./get"));
const create_1 = __importDefault(require("./create"));
const remove_1 = __importDefault(require("./remove"));
const update_1 = __importDefault(require("./update"));
const list_1 = __importDefault(require("./list"));
/**
 * Mercado Pago Customer card.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/cards/_customers_customer_id_cards/post Documentation }.
 */
class CustomerCard {
    constructor(mercadoPagoConfig) {
        this.config = mercadoPagoConfig;
    }
    /**
     * Mercado Pago Customer card create.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/create.ts Usage Example  }.
     */
    create({ customerId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, create_1.default)({ customerId: customerId, body, config: this.config });
    }
    /**
     * Mercado Pago customer card get.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/get.ts Usage Example  }.
    */
    get({ customerId, cardId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, get_1.default)({ customerId: customerId, cardId: cardId, config: this.config });
    }
    /**
     * Mercado Pago customer card remove.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/remove.ts Usage Example  }.
     */
    remove({ customerId, cardId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, remove_1.default)({ customerId: customerId, cardId: cardId, config: this.config });
    }
    /**
     * Mercado Pago customer card update.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/update.ts Usage Example  }.
     */
    update({ customerId, cardId, body, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, update_1.default)({ customerId: customerId, cardId: cardId, body, config: this.config });
    }
    /**
     * Mercado Pago customer card list.
     *
     * @see {@link https://github.com/mercadopago/sdk-nodejs/blob/master/src/examples/customer/list.ts Usage Example  }.
     */
    list({ customerId, requestOptions }) {
        this.config.options = Object.assign(Object.assign({}, this.config.options), requestOptions);
        return (0, list_1.default)({ customerId: customerId, config: this.config });
    }
}
exports.CustomerCard = CustomerCard;
